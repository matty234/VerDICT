import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, mergeMap, takeUntil, tap } from 'rxjs/operators';
import { QueryLoadingBarService } from './query-loading-bar.service';

@Component({
	selector: 'app-query-loading-bar',
	templateUrl: './query-loading-bar.component.html',
	styleUrls: [ './query-loading-bar.component.scss' ],
})
export class QueryLoadingBarComponent implements OnInit, OnDestroy {

	$destroy = new Subject<void>();
	loadingBarService: Observable<boolean>;

	constructor(private lbs: QueryLoadingBarService) {}

	ngOnInit() {
		this.loadingBarService = this.lbs.shouldShow.pipe(takeUntil(this.$destroy));
	}

	ngOnDestroy() {
		this.$destroy.next();
		this.$destroy.unsubscribe();
	}
}
