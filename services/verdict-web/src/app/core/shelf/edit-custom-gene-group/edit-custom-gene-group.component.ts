import { Component, Inject, InjectionToken, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { CustomGeneGroupShelfValue } from 'src/app/core/shelf/shelf.model';
import { Gene } from 'src/app/directory/gene/gene.model';
import { ShelfService } from '../shelf.service';

export const SHELF_VALUE_UID = new InjectionToken<{}>('SHELF_VALUE_UID');

@Component({
	selector: 'app-edit-custom-gene-group',
	templateUrl: './edit-custom-gene-group.component.html',
	styleUrls: [ './edit-custom-gene-group.component.css' ],
})
export class EditCustomGeneGroupOverlayComponent implements OnInit, OnDestroy {
	shelfValue: CustomGeneGroupShelfValue = null;
	genes = new Array<Gene>();
	$destroy = new Subject<void>();

	constructor(
		@Inject(SHELF_VALUE_UID) private svUID: string,
		private shelfService: ShelfService,
	) {
		this.shelfValue = this.shelfService.getByUid<CustomGeneGroupShelfValue>(svUID);
		this.getShelfValueGenes();
		this.shelfService.mutate$.pipe(takeUntil(this.$destroy)).subscribe(() => this.getShelfValueGenes());
	}

	getShelfValueGenes() {
		this.shelfValue = this.shelfService.getByUid<CustomGeneGroupShelfValue>(this.svUID);
		this.genes = this.shelfValue.genes;
	}

	ngOnInit() {}

	delete(geneid: number, event: Event) {
		event.stopPropagation();
		this.shelfService.removeFromGeneGroup(this.shelfValue.uid, geneid);
	}

	ngOnDestroy() {
		this.$destroy.next();
		this.$destroy.unsubscribe();
	}
}
