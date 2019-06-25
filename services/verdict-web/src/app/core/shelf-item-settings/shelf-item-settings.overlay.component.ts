
import { Component, Inject, InjectionToken, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DiseaseShelfValue } from 'src/app/core/shelf/shelf.model';
import { ShelfService } from '../shelf/shelf.service';

export const PHENOTYPE_ID = new InjectionToken<{}>('PHENOTYPEID');

@Component({
	selector: 'app-shelf-item-settings-overlay',
	templateUrl: './shelf-item-settings.overlay.component.html',
	styleUrls: [ './shelf-item-settings.overlay.component.scss' ],
})
export class ShelfItemSettingsOverlayComponent implements OnInit, OnDestroy {
	shelfValue: FormGroup;

	constructor(@Inject(PHENOTYPE_ID) private id = '', private shelfService: ShelfService) {}

	ngOnInit() {
		const targetShelfValue = this.shelfService.get().find((ssv) => ssv.uid === this.id);

		if (DiseaseShelfValue.isDiseaseShelfValue(targetShelfValue)) {
			this.shelfValue = new FormGroup({
				uid: new FormControl(),
				name: new FormControl(''),
				colour: new FormControl(''),
				minScore: new FormControl(0),
				limit: new FormControl(0),
				geneSet: new FormControl('HAS_GENE'),
			});
			this.shelfValue.setValue(
				(({ uid, name, colour, minScore, limit, geneSet }) => ({
					uid,
					name,
					colour,
					minScore,
					limit,
					geneSet,
				}))(targetShelfValue),
			);
		} else {
			this.shelfValue = new FormGroup({
				uid: new FormControl(),
				name: new FormControl(''),
				colour: new FormControl(''),
			});
			this.shelfValue.setValue((({ uid, name, colour }) => ({ uid, name, colour }))(targetShelfValue));
		}
	}

	ngOnDestroy() {
		if (this.shelfValue.dirty) {
			this.shelfService.change(this.id, this.shelfValue.value);
			this.shelfValue.markAsPristine();
		}
	}
}
