import { NoopScrollStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { Component, Inject, InjectionToken, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { flatMap, takeUntil, tap } from 'rxjs/operators';
import { ShelfService } from '../../core/shelf/shelf.service';
import { PhenotypeService } from '../phenotype/phenotype.service';

export const PHENOTYPE_ID = new InjectionToken<{}>('PHENOTYPEID');

@Component({
	templateUrl: './add-multiple-shelf-dialog.component.html',
	styleUrls: [ './add-multiple-shelf-dialog.component.css' ],
})
export class AddMultipleShelfDialogComponentOverlayComponent implements OnInit, OnDestroy {
	private _limit = 0;

	$destroy = new Subject<void>();

	set limit(v: number) {
		if (v === null) {
			v = 0;
		}
		this._limit = +v;
	}

	get limit() {
		return this._limit;
	}

	private modalClose: Subject<any> = new Subject();

	constructor(
		@Inject(PHENOTYPE_ID) private phenotype: number,
		private shelfService: ShelfService,
		private phenotypeService: PhenotypeService,
	) {}

	ngOnInit() {}

	add(): void {
		this.phenotypeService
			.getRelatedPhenotypes(this.phenotype, undefined, this.limit)
			.pipe(takeUntil(this.$destroy), flatMap((x) => x))
			.subscribe((phenotype) => {
				this.shelfService.add(phenotype.shelfValue);
			});
		this.modalClose.next();

	}

	onModalClose(): Observable<any> {
		return this.modalClose.asObservable();
	}

	ngOnDestroy() {
	this.$destroy.next();
	this.$destroy.unsubscribe();
	}
}
