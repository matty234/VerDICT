import { ChangeDetectorRef, Component, Input, NgZone, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Observable, Subject } from 'rxjs';
import { mergeMap, takeUntil, tap } from 'rxjs/operators';

import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { QueryLoadingBarService } from '../../core/query-loading-bar/query-loading-bar.service';
import { Gene } from '../gene/gene.model';
import { GeneService } from '../gene/gene.service';
import { Phenotype } from './phenotype.model';
import { PhenotypeService } from './phenotype.service';

@Component({
	selector: 'app-phenotype',
	templateUrl: './phenotype.component.html',
	styleUrls: [ './phenotype.component.scss' ],
})
export class PhenotypeComponent implements OnChanges, OnDestroy {
	notFound = false;
	related = new Observable<Phenotype[]>();
	phenotype: Phenotype;

	genes: Observable<Gene[]>;
	morbidMap: Observable<Gene[]>;
	cardiganPredictions = new Observable<Gene[]>();

	@Input() selectedPhenotype = new Observable<number>();

	private onDestroy$: Subject<void> = new Subject();

	constructor(
		private pService: PhenotypeService,
		private gService: GeneService,
		private queryLoadingBarService: QueryLoadingBarService,
		private cd: ChangeDetectorRef,
	) {
		queryLoadingBarService.show();
	}

	ngOnChanges() {
		this.selectedPhenotype
			.pipe(
				takeUntil(this.onDestroy$),
				tap((newPhenotype) => {
					this.pService.getPhenotype(newPhenotype).pipe(takeUntil(this.onDestroy$)).subscribe(
						(phenotype) => {
							this.phenotype = phenotype;
							this.notFound = false;
						},
						() => {
							this.notFound = true;
						},
					);
				}),
			)
			.subscribe(() => {
				this.cd.detectChanges();
				this.queryLoadingBarService.hide();

				this.genes = this.selectedPhenotype.pipe(
					takeUntil(this.onDestroy$),
					mergeMap((id) => this.pService.getGenes(id)),
				);

				this.related = this.selectedPhenotype.pipe(
					takeUntil(this.onDestroy$),
					mergeMap((newPhenotype) => this.pService.getRelatedPhenotypes(newPhenotype)),
				);

				this.cardiganPredictions = this.selectedPhenotype.pipe(
					takeUntil(this.onDestroy$),
					mergeMap((newPhenotype) => this.pService.getCardiganPredictedGenes(newPhenotype, 50)),
					tap(() => {
						this.cd.detectChanges();
					}),
				);
			});
	}

	ngOnDestroy() {
		this.onDestroy$.next();
		this.onDestroy$.unsubscribe();
	}

	openOmim() {
		window.open(environment.omim + this.phenotype.omim, '_blank');
	}
}

@Component({
	selector: 'app-phenotype-name',
	template: `<div class="phenotype-link">
								<div class="omim clickable">#{{phenotype?.omim}}</div>
								<div class="short-name clickable">{{shortName}}</div>
								<ng-content></ng-content>
								<span></span>
								<button (click)="openOmim($event)" class="omim-button" mat-icon-button color="primary">
									<mat-icon class="omim-link">open_in_new</mat-icon>
								</button>
						</div>`,
	styles: [
		`
		:host {
			width: 100%;
		}
		.clickable {
			cursor: pointer;
		}
		.omim-button {
			margin-top: -7px;
			margin-left: auto;
		}
		.omim {
			color: #656565;
			font-weight: 300;
			padding-right: 5px;
			display: inline;
		}
		.phenotype-link {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
		.short-name {
			flex-grow: 1;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			margin-right: 10px;
		}
		`,
	],
})
export class PhenotypeNameComponent implements OnChanges {
	@Input() phenotype: Phenotype;
	private splitNames;

	constructor(private zone: NgZone, private router: Router) {}

	get shortName() {
		return this.splitNames[0];
	}

	get hasMultipleNames() {
		return this.splitNames.length > 1;
	}

	ngOnChanges(): void {
		this.splitNames = this.phenotype.name;
	}

	openOmim(event: Event) {
		event.stopPropagation();
		window.open(environment.omim + this.phenotype.omim, '_blank');
	}
}
