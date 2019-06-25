import {
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnDestroy,
	OnInit,
	Output,
	ViewChild,
} from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import {
	combineAll,
	combineLatest,
	concatAll,
	concatMap,
	debounceTime,
	finalize,
	mergeMap,
	switchMap,
	takeUntil,
	tap,
	toArray,
	zip,
	zipAll,
} from 'rxjs/operators';
import { KegResponse } from './pathways.model';
import { PathwaysService } from './pathways.service';

import { FormControl } from '@angular/forms';
import { CustomGeneGroupShelfValue } from 'src/app/core/shelf/shelf.model';
import { ShelfService } from 'src/app/core/shelf/shelf.service';
import { Gene } from 'src/app/directory/gene/gene.model';
import { GeneService } from 'src/app/directory/gene/gene.service';
import { ImportStatus } from 'src/app/home/importer/importer.model';

@Component({
	selector: 'app-pathways',
	templateUrl: './pathways.component.html',
	styleUrls: [ './pathways.component.scss' ],
})
export class PathwaysComponent implements OnInit, OnDestroy, AfterViewInit {
	kegs = new Array<KegResponse>();
	$destroy = new Subject<void>();
	searchQuery = new FormControl();
	loading = false;

	@Input() entrez = -1;
	@Output() complete = new EventEmitter<ImportStatus>();

	constructor(private pathwaysService: PathwaysService, private shelfService: ShelfService) {}

	ngOnInit() {
		if (this.entrez !== -1) {
			this.loadPathways();
		}
		this.searchQuery.valueChanges
			.pipe(
				takeUntil(this.$destroy),
				tap(() => {
					this.loading = true;
				}),
				debounceTime(500),
				mergeMap((query) =>
					this.pathwaysService.searchPathways(query).pipe(
						takeUntil(this.$destroy),
						finalize(() => {
							this.loading = false;
						}),
					),
				),
			)
			.subscribe((results) => {
				this.kegs = results;
			});
	}
	ngAfterViewInit() {}

	loadPathways() {
		this.loading = true;
		this.pathwaysService.getPathways(this.entrez).pipe(takeUntil(this.$destroy)).subscribe((pathways) => {
			this.kegs = pathways;
			this.loading = false;
		});
	}

	ngOnDestroy() {
		this.$destroy.next();
		this.$destroy.complete();
	}

	addPathway(pathway: KegResponse) {
		this.loading = true;
		this.pathwaysService.getPathway(pathway.id).pipe(takeUntil(this.$destroy)).subscribe((genes) => {
			this.shelfService.add(
				new CustomGeneGroupShelfValue({
					name: pathway.name,
					colour: '#00FF00',
					genes,
				}),
			);
			this.complete.emit({
				success: genes.length,
				count: 0,
				fail: 0,
			});
		});
	}
}
