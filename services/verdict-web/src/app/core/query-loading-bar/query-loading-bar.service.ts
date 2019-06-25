import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
		providedIn: 'root',
})
export class QueryLoadingBarService {

	shouldShow: Subject<boolean> = new Subject<boolean>();
	constructor() { }

	show() {
		this.shouldShow.next(true);
	}

	hide() {
		setTimeout(() => {
			this.shouldShow.next(false);
		}, 500);
	}

}
