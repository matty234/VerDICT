import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { skip, take, takeUntil, tap } from 'rxjs/operators';
import { Gene } from '../gene/gene.model';
import { GeneService } from '../gene/gene.service';

@Component({
	selector: 'app-gene-interacts-with',
	templateUrl: './gene-interacts-with.component.html',
	styleUrls: [ './gene-interacts-with.component.css' ],
})
export class GeneInteractsWithComponent implements OnInit, OnDestroy {
	@Input() gene: Observable<number>;

	genes: Gene[] = [];
	relatedGenes: Gene[] = [];

	loading = true;
	isShowingMore = false;
	$genes: Observable<Gene[]>;
	$destroy = new Subject<void>();

	constructor(private gService: GeneService,
		           private changeDetectorRef: ChangeDetectorRef) {}

	ngOnInit() {
		this.genes = [];
		this.gene
			.pipe(
				takeUntil(this.$destroy),
				tap(() => {
					this.genes = [];
				}),
			)
			.subscribe((id) => {
				this.loadInteractsWith(id);
			});
	}

	showMore(): void {
		this.isShowingMore = true;
	}

	loadInteractsWith(id: number) {
		this.$genes = this.gService.getInteractsWith(id);
	}

	ngOnDestroy() {
	this.$destroy.next();
	this.$destroy.unsubscribe();
	}
}
