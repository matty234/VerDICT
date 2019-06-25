import { Injectable, OnDestroy } from '@angular/core';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { Subject } from 'rxjs';
import { concat } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class TargetExplorerService implements OnDestroy {
	locationChange = new Subject<{ uid: string; entrez: number; source: 'list' | 'network' }>();

	constructor() {}

	scrollToGeneFromList(uid: string, entrez: number) {
		this.locationChange.next({
			uid,
			entrez,
			source: 'list',
		});
	}

	scrollToGene(uid: string, entrez: number) {
		this.locationChange.next({
			uid,
			entrez,
			source: 'network',
		});
	}

	ngOnDestroy() {
		this.locationChange.unsubscribe();
	}
}
