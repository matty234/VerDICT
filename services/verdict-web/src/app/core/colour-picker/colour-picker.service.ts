import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class ColourPickerService implements OnDestroy {

	pickedColour = new Subject<string>();

	constructor() {}

	pickColour(colour: string): void {
		this.pickedColour.next(colour);
	}

	ngOnDestroy() {
		this.pickedColour.unsubscribe();
	}
}
