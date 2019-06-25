import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { QueryLoadingBarService } from '../core/query-loading-bar/query-loading-bar.service';
import { ShelfService } from '../core/shelf/shelf.service';
import { Gene } from '../directory/gene/gene.model';
import { PhenotypeService } from '../directory/phenotype/phenotype.service';

/**
 * Lists the Genes that appear in the Cardigan result sets intersection according to the values in the shelf.
 */
@Component({
	selector: 'app-cardigan',
	templateUrl: './cardigan.component.html',
	styleUrls: [ './cardigan.component.css' ],
})
export class CardiganComponent implements OnInit, OnDestroy {

	$destroy = new Subject<void>();
	genes: Gene[] = [];
	names: string[] = [];

	constructor(
		private pService: PhenotypeService,
		private shelfService: ShelfService,
		private cd: ChangeDetectorRef,
		private qlbs: QueryLoadingBarService,
	) {}

	ngOnInit() {
		this.shelfService.mutate$.pipe(takeUntil(this.$destroy)).subscribe(this.load.bind(this));
		this.load();
	}
	load(): void {
	/*	this.genes = [];
		this.names = [];
		this.qlbs.show();
		this.names = this.shelfService.get().map((shelfValue) => shelfValue.name);
		if (this.names.length !== 0) {
			this.pService
				.getCardiganIntersect(this.shelfService.get())
				.pipe(
					takeUntil(this.$destroy),
					tap(() => {
						this.qlbs.hide();
					})
				)
				.subscribe((genes) => {
					this.genes = genes;
					this.cd.detectChanges();
				});
		} else {
			this.qlbs.hide();
		}*/
	}

	ngOnDestroy() {
		this.$destroy.next();
		this.$destroy.unsubscribe();
	}
}
