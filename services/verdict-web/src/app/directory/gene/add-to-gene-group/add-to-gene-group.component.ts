import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, InjectionToken, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs';
import { CustomGeneGroupShelfValue, StoredShelfValue } from 'src/app/core/shelf/shelf.model';
import { ShelfService } from 'src/app/core/shelf/shelf.service';
import { Gene } from '../gene.model';

export const GENE_INJECTION_TOKEN = new InjectionToken<{}>('GENE');

@Component({
	selector: 'app-add-to-gene-group',
	templateUrl: './add-to-gene-group.component.html',
	styleUrls: [ './add-to-gene-group.component.css' ],
})
export class AddToGeneGroupComponent implements OnInit {
	selectedUID = null;
	shelfValues = [];

	public complete = new Subject<void>();

	constructor(
		@Inject(GENE_INJECTION_TOKEN) public gene: Gene,
		private shelfService: ShelfService,
		private cd: ChangeDetectorRef,
		private matSnackBar: MatSnackBar,
	) {}

	ngOnInit() {
		this.shelfValues = this.shelfService
			.get()
			.filter((ssv) => CustomGeneGroupShelfValue.isCustomGeneGroupShelfValue(ssv));
		if (this.shelfValues.length > 0) {
			this.selectedUID = this.shelfValues[0].uid;
		}
	}

	addToGroup() {
		if (this.selectedUID) {
			this.shelfService.addToGeneGroup(this.selectedUID, this.gene);
			this.complete.next();
			this.matSnackBar.open(`Gene added to gene group`, null, {
				duration: 3000,
			});
		}
	}

	createNewGeneGroup(event: Event) {
		event.preventDefault();
		event.stopPropagation();
		const newGroup = new CustomGeneGroupShelfValue({});
		this.shelfService.add(newGroup);
		this.shelfValues.push(newGroup);
		this.selectedUID = newGroup.uid;
	}

	onPathwaySelected() {
		this.complete.next();
		this.matSnackBar.open(`Selected pathway added to the shelf`, null, {
			duration: 3000,
		});
	}
}
