import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Observable, Subject } from 'rxjs';
import { map, mergeMap, takeUntil, tap } from 'rxjs/operators';
import { ShelfService } from 'src/app/core/shelf/shelf.service';
import { Gene } from 'src/app/directory/gene/gene.model';
import { CustomGeneGroupShelfValue } from '../../core/shelf/shelf.model';
import { PathwaysService } from '../gene/pathways/pathways.service';

@Component({
	selector: 'app-pathway-list',
	templateUrl: './pathway-list.component.html',
	styleUrls: [ './pathway-list.component.scss' ],
})
export class PathwayListComponent implements OnInit, OnDestroy {
	genes: Observable<Gene[]>;

	@Input() selectedPathway: Observable<string>;

	$destroy = new Subject<void>();

	constructor(
		private pathwayService: PathwaysService,
		private shelfService: ShelfService,
		private snackbar: MatSnackBar,
	) {}

	ngOnInit() {
		this.genes = this.selectedPathway.pipe(
			takeUntil(this.$destroy),
			mergeMap((selected) => this.pathwayService.getPathway(selected).pipe(takeUntil(this.$destroy))),
		);
	}

	addToShelf() {
		this.genes.pipe(takeUntil(this.$destroy)).subscribe((genes) => {
			this.shelfService.add(
				new CustomGeneGroupShelfValue({
					name: 'Pathway',
					colour: '#00FF00',
					genes,
				}),
			);
			this.snackbar.open(`Pathway added to the shelf`, null, {
				duration: 3000,
			});
		});
	}

	getContextURL(entrez: number): Observable<string> {
		return this.selectedPathway.pipe(map((selected) => {
			return `https://www.genome.jp/kegg-bin/show_pathway?${selected}+${entrez}`;
		}));
	}

	ngOnDestroy() {
	this.$destroy.next();
	this.$destroy.unsubscribe();
	}
}
