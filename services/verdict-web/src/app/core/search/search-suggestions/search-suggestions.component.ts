import {
	ChangeDetectorRef,
	Component,
	ElementRef,
	HostListener,
	Inject,
	InjectionToken,
	NgZone,
	OnDestroy,
	OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { concat, forkJoin, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, finalize, flatMap, map, mergeMap, switchMap, takeUntil } from 'rxjs/operators';
import { Gene } from 'src/app/directory/gene/gene.model';
import { Phenotype } from 'src/app/directory/phenotype/phenotype.model';

import { ISearchQuery, SearchIDs } from '../search-bar/search-bar.component';
import { SearchResult, SearchResults } from '../search.model';
import { SearchService } from '../search.service';

export const SEARCH_QUERY = new InjectionToken<{}>('SEARCH_QUERY');

@Component({
	selector: 'app-search-suggestions',
	templateUrl: './search-suggestions.component.html',
	styleUrls: [ './search-suggestions.component.css' ],
})
export class SearchSuggestionsComponent implements OnInit, OnDestroy {
	clickedOutside = new Subject<Event>();
	selectedItem = new Subject<void>();

	$destroy = new Subject<void>();
	isLoading = false;
	searchResults: SearchResults = [];
	constructor(
		@Inject(SEARCH_QUERY) public query: Observable<ISearchQuery>,
		private searchService: SearchService,
		private elementRef: ElementRef,
		private router: Router,
		private cd: ChangeDetectorRef,
		private zone: NgZone,
	) {}

	ngOnInit() {
		this.isLoading = true;
		this.query
			.pipe(
				takeUntil(this.$destroy),
				filter(({ query }) => query && query !== ''),
				switchMap((newVal) =>
					this.searchService.searchFor(newVal.typeId, newVal.query).pipe(
						takeUntil(this.$destroy),
						finalize(() => {
							this.isLoading = false;
						}),
					),
				),
			)
			.subscribe((results) => {
				this.searchResults = results;
				this.cd.detectChanges();
			});

		this.query.pipe(map((q: ISearchQuery) => q.typeId), distinctUntilChanged()).subscribe(() => {
			this.searchResults = [];
		});
	}

	@HostListener('document:click', [ '$event' ])
	clickedOutsideHandler($event: Event) {
		if (!this.elementRef.nativeElement.contains(event.target)) {
			this.clickedOutside.next($event);
		}
	}

	toItem(item: SearchResult) {
		this.zone.run(() => {
			this.selectedItem.next();
			if (this.isPhenotype(item)) {
				this.router.navigate([ '/phenotype', item.omim ]);
			} else if (this.isGene(item)) {
				this.router.navigate([ '/gene', item.entrez ]);
			} else {
				this.router.navigate([ '/pathway', item.id ]);
			}
		});
	}

	isPhenotype(arg: any): arg is Phenotype {
		return arg !== undefined && arg.omim !== undefined;
	}

	isGene(arg: any): arg is Gene {
		return arg !== undefined && arg.official_symbol !== undefined;
	}

	ngOnDestroy() {
		this.cd.detach();
		this.$destroy.next();
		this.$destroy.unsubscribe();
	}
}
