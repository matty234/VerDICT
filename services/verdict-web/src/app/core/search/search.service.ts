import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { KegResponse } from '../../directory/gene/pathways/pathways.model';
import { PathwaysService } from '../../directory/gene/pathways/pathways.service';
import { SearchIDs } from './search-bar/search-bar.component';
import { SearchResults } from './search.model';

@Injectable({
	providedIn: 'root',
})
export class SearchService implements OnDestroy {
	$destroy = new Subject<void>();
	searchPattern = new RegExp('([*#a-zA-Z0-9])+');

	constructor(
		private pathwayService: PathwaysService,
		private http: HttpClient,
	) {}

	/**
	 * Queries the graph database using a full text index over Phentype.name, Phenotype.omim and Gene.entrez
	 * @param query the search string
	 */
	searchFor(searchType: SearchIDs, input: string): Observable<SearchResults> {
		if (searchType === 'PATHWAY') {
			return this.pathwayService
				.searchPathways(input)
				.pipe(map((r) => r.map((k) => ({ ...k, type: 'PATHWAY' } as KegResponse & { type: SearchIDs }))));
		} else {
			const query = input.replace('*', '').replace('#', '');
			if (this.searchPattern.test(query)) {
				return this.http
					.get<SearchResults>(
						`${environment.api.root}/${environment.api.search}/${searchType === 'PHENOTYPE' ? 'phenotype' : 'gene'}?query=${query}`,
					)
					.pipe(takeUntil(this.$destroy));
			} else {
				return of([]);
			}
		}
	}

	ngOnDestroy() {
		this.$destroy.next();
		this.$destroy.unsubscribe();
	}
}
