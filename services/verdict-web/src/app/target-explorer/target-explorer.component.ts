import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ChangeDetectorRef, Component, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { Observable, Subject } from 'rxjs';
import { debounceTime, filter, map, takeUntil } from 'rxjs/operators';

import { CustomGeneGroupShelfValue, DiseaseShelfValue } from '../core/shelf/shelf.model';
import { ShelfService } from '../core/shelf/shelf.service';
import { Gene } from '../directory/gene/gene.model';
import { CardiganPPIRelation } from '../directory/phenotype/phenotype.model';
import { PhenotypeService } from '../directory/phenotype/phenotype.service';
import { PhenotypeForGeneComponent, TARGET_GENE_ENTREZ } from './phenotype-for-gene/phenotype-for-gene.component';
import { TargetExplorerService } from './target-explorer.service';

@Component({
	selector: 'app-target-explorer',
	templateUrl: './target-explorer.component.html',
	styleUrls: [ './target-explorer.component.scss' ],
})
export class TargetExplorerComponent implements OnInit, OnDestroy {
	genes: Gene[] = null;
	$destroy = new Subject<void>();
	shelfPhenotypes = [];

	@Input() graphValues: CardiganPPIRelation;
	displayedGraphValues: Observable<Gene[]>;

	searchFormControl = new FormControl('');

	private _selectedPhenotype: string;
	private forPhenotypesOverlayRef: OverlayRef;
	private forPhenotypesOverlayComponent: ComponentPortal<PhenotypeForGeneComponent>;

	noShelfValues = false;

	noop = () => {};
	get selectedUID(): string {
		return this._selectedPhenotype;
	}

	set selectedUID(v: string) {
		this._selectedPhenotype = v;
		this.genes = null;
		this.loadTargets(() => {});
	}

	constructor(
		private shelfService: ShelfService,
		private targetExplorerService: TargetExplorerService,
		private scrollToService: ScrollToService,
		private changeDetector: ChangeDetectorRef,
		private overlay: Overlay,
		private injector: Injector,
		private router: Router,
		private pService: PhenotypeService,
	) {}

	ngOnInit() {
		this.shelfService.mutate$.pipe(takeUntil(this.$destroy)).subscribe(() => {
			this.load();
		});
		this.load();

		this.displayedGraphValues = this.searchFormControl.valueChanges.pipe(
			takeUntil(this.$destroy),
			debounceTime(500),
			map((r) => r.toUpperCase()),
			map((v) =>
				this.graphValues.nodes.filter(
					(gene) => gene.entrez === Number(v) || gene.official_symbol.includes(String(v)),
				),
			),
		);
	}

	load() {
		const target = this.shelfService.getTarget();
		if (target) {
			this.noShelfValues = false;
			this.shelfPhenotypes = this.shelfService.get();
			this._selectedPhenotype = target.uid;
			this.loadTargets(this.noop);

			this.targetExplorerService.locationChange
				.pipe(takeUntil(this.$destroy), filter((location) => location.source === 'network'))
				.subscribe((newLocation) => {
					if (this.selectedUID !== newLocation.uid) {
						this._selectedPhenotype = newLocation.uid;
						this.loadTargets(() => {
							this.scrollToService.scrollTo({
								target: `target-${newLocation.entrez}`,
								duration: 300,
							});
						});
					} else {
						this.scrollToService.scrollTo({
							target: `target-${newLocation.entrez}`,
							duration: 300,
						});
					}
				});
		} else {
			this.noShelfValues = true;
		}
	}

	loadTargets(done: () => void): void {
		const selectedShelfValue = this.shelfService.get().find((value) => value.uid === this._selectedPhenotype);
		if (DiseaseShelfValue.isDiseaseShelfValue(selectedShelfValue)) {
			const geneSource =
				selectedShelfValue.geneSet === 'HAS_GENE'
					? this.pService.getGenes(selectedShelfValue.omim, selectedShelfValue.limit)
					: this.pService.getCardiganPredictedGenes(selectedShelfValue.omim, selectedShelfValue.limit);
			geneSource.pipe(takeUntil(this.$destroy)).subscribe((v) => {
				this.genes = v;
				this.changeDetector.detectChanges();
				done();
			});
		} else if (CustomGeneGroupShelfValue.isCustomGeneGroupShelfValue(selectedShelfValue)) {
			this.genes = selectedShelfValue.genes;
		}
	}

	ngOnDestroy() {
		this.$destroy.next();
		this.$destroy.unsubscribe();
	}

	navigateTo(gene: Gene, event: Event) {
		event.stopPropagation();
		this.targetExplorerService.scrollToGeneFromList('', gene.entrez);
	}

	showPhenotypes(gene: Gene) {
		const injectorTokens = new WeakMap();
		injectorTokens.set(TARGET_GENE_ENTREZ, gene);

		this.forPhenotypesOverlayRef = this.overlay.create(this.getOverlayConfig());
		this.forPhenotypesOverlayComponent = new ComponentPortal(
			PhenotypeForGeneComponent,
			null,
			new PortalInjector(this.injector, injectorTokens),
		);
		this.forPhenotypesOverlayRef.backdropClick().pipe(takeUntil(this.$destroy)).subscribe(() => {
			this.forPhenotypesOverlayRef.detach();
		});

		this.router.events
			.pipe(
				takeUntil(this.$destroy),
				filter((event) => {
					return event instanceof NavigationStart;
				}),
			)
			.subscribe(() => {
				this.forPhenotypesOverlayRef.detach();
			});
		this.forPhenotypesOverlayRef.attach(this.forPhenotypesOverlayComponent);
	}

	private getOverlayConfig(): OverlayConfig {
		const positionStrategy = this.overlay.position().global().centerHorizontally().centerVertically();

		const overlayConfig = new OverlayConfig({
			hasBackdrop: true,
			backdropClass: 'cdk-overlay-dark-backdrop',
			scrollStrategy: this.overlay.scrollStrategies.close(),
			positionStrategy,
		});

		return overlayConfig;
	}

	openGene(entrez: number, e: Event) {
		e.stopPropagation();
		this.router.navigate(['gene', entrez]);
	}
}
