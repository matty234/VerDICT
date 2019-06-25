import { NoopScrollStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ChangeDetectorRef, Component, Injector, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { QueryLoadingBarService } from '../../core/query-loading-bar/query-loading-bar.service';
import { DirectoryComponent } from '../directory.component';
import { AddToGeneGroupComponent, GENE_INJECTION_TOKEN } from './add-to-gene-group/add-to-gene-group.component';
import { Gene } from './gene.model';
import { GeneService } from './gene.service';

@Component({
	selector: 'app-gene',
	templateUrl: './gene.component.html',
	styleUrls: [ './gene.component.scss' ],
})
export class GeneComponent implements OnInit, OnChanges, OnDestroy {
	@Input() selectedGene: Observable<number>;

	notFound = false;
	gene: Gene;
	injectorTokens = new WeakMap();
	$destroy = new Subject<void>();
	overlayComponent: ComponentPortal<AddToGeneGroupComponent>;
	overlayRef: OverlayRef;

	constructor(
		private geneService: GeneService,
		private queryLoadingBarService: QueryLoadingBarService,
		private changeDetectorRef: ChangeDetectorRef,
		private overlay: Overlay,
		private injector: Injector,
	) {
		queryLoadingBarService.show();
	}

	ngOnChanges() {
		this.gene = null;
		this.notFound = false;
	}

	ngOnInit() {
		this.selectedGene.pipe(takeUntil(this.$destroy)).subscribe((geneName) => {
			this.gene = null;
			this.notFound = false;
			this.queryLoadingBarService.show();
			this.geneService.getGene(geneName).pipe(takeUntil(this.$destroy)).subscribe({
				next: (gene) => {
					if (gene === null) {
						this.notFound = true;
					} else {
						this.gene = gene;
						this.injectorTokens.set(GENE_INJECTION_TOKEN, this.gene);
					}
				},
			});
		});
		this.queryLoadingBarService.hide();
		this.overlayComponent = new ComponentPortal(
			AddToGeneGroupComponent,
			null,
			new PortalInjector(this.injector, this.injectorTokens),
		);
		const positionStrategy = this.overlay.position().global().centerHorizontally().centerVertically();

		this.overlayRef = this.overlay.create({
			hasBackdrop: true,
			width: 410,
			positionStrategy,
			scrollStrategy: new NoopScrollStrategy(),
		});
		this.overlayRef.backdropClick().pipe(takeUntil(this.$destroy)).subscribe(() => {
			this.closeAddToGeneGroupInShelf();
		});
	}

	closeAddToGeneGroupInShelf() {
		this.overlayRef.detach();
		this.changeDetectorRef.detectChanges();
	}

	addToGeneGroupInShelf() {
		const attachedRef = this.overlayRef.attach(this.overlayComponent);
		attachedRef.instance.complete.pipe(takeUntil(this.$destroy)).subscribe(() => {
			this.closeAddToGeneGroupInShelf();
		});
	}
	openNCBI() {
		window.open(environment.ncbi + this.gene.entrez, '_blank');
	}
	openKEGG() {
		window.open(environment.kegg + this.gene.entrez, '_blank');
	}

	ngOnDestroy() {
		this.$destroy.next();
		this.$destroy.unsubscribe();
	}
}
