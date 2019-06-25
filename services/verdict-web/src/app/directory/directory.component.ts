import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { Data, ViewType } from '../app.model';

@Component({
	selector: 'app-network',
	templateUrl: './directory.component.html',
	styleUrls: [ './directory.component.css' ],
})
export class DirectoryComponent implements OnInit {
	viewTypes = ViewType;

	selectedViewType = new Observable<ViewType>();
	selectedParam = new Observable<any>();

	constructor(private activatedRoute: ActivatedRoute) {}

	ngOnInit() {
		this.selectedViewType = (this.activatedRoute.data as Observable<Data>).pipe(map(({ viewType }) => viewType));

		this.selectedParam = this.activatedRoute.paramMap.pipe(
			filter((params) => {
				return params.has('id');
			}),
			map((params) => {
				return params.get('id');
			}),
		);
	}
}
