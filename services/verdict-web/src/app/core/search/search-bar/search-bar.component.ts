import { CloseScrollStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import {
	ChangeDetectorRef,
	Component,
	ElementRef,
	Injector,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { debounceTime, filter, finalize, mergeMap, skip, switchMap, takeUntil, tap } from 'rxjs/operators';
import { SEARCH_QUERY, SearchSuggestionsComponent } from '../search-suggestions/search-suggestions.component';
import { SearchResult, SearchResults } from '../search.model';
import { SearchService } from '../search.service';

interface ISearchType {
	id: SearchIDs;
	name: string;
}

export type SearchIDs = 'PHENOTYPE' | 'GENE' | 'PATHWAY';
export interface ISearchQuery {
	typeId: SearchIDs;
	query: string;
}

@Component({
	selector: 'app-search-bar',
	templateUrl: './search-bar.component.html',
	styleUrls: [ './search-bar.component.scss' ],
})
export class SearchBarComponent implements OnInit, OnDestroy, OnChanges {
	@Input() selectedSearchType: SearchIDs;
	searchTypes: ISearchType[] = [
		{
			id: 'PHENOTYPE',
			name: 'Phenotype',
		},
		{
			id: 'GENE',
			name: 'Gene',
		},
		{
			id: 'PATHWAY',
			name: 'Pathway',
		},
	];

	searchResults: SearchResults;
	@Input() initialValue: string;

	searchTerm: FormControl = new FormControl(this.initialValue);
	$destroy = new Subject<void>();
	cleanOnClick = false;
	isLoading = false;

	searchQuery = new Subject<ISearchQuery>();

	overlayRef: OverlayRef;
	suggestionComponent: ComponentPortal<SearchSuggestionsComponent>;

	@ViewChild('searchExtras') searchExtrasElementRef: ElementRef;
	@ViewChild('searchInput') searchInputElementRef: ElementRef;
	@ViewChild('searchField') searchFieldElementRef: ElementRef;
	@Input() shouldFocus = false;

	constructor(private router: Router, private injector: Injector, private overlay: Overlay) {}

	ngOnChanges() {
		this.searchTerm.setValue(this.initialValue, { emitEvent: false });
		if (this.initialValue) {
			this.cleanOnClick = true;
		}
	}

	createInjector(): PortalInjector {
		const injectorTokens = new WeakMap();
		injectorTokens.set(SEARCH_QUERY, this.searchQuery.asObservable());
		return new PortalInjector(this.injector, injectorTokens);
	}

	buildSuggestionStrategy() {
		this.suggestionComponent = new ComponentPortal(SearchSuggestionsComponent, null, this.createInjector());
		const positionStrategy = this.overlay
			.position()
			.flexibleConnectedTo(this.searchFieldElementRef)
			.withFlexibleDimensions(true)
			.withDefaultOffsetY(-(this.searchExtrasElementRef.nativeElement.clientHeight + 5))
			.withPositions([
				{
					originX: 'start',
					originY: 'bottom',
					overlayX: 'start',
					overlayY: 'top',
				},
			]);

		this.overlayRef = this.overlay.create({
			hasBackdrop: false,
			maxHeight: 300,
			width: this.searchFieldElementRef.nativeElement.clientWidth,
			positionStrategy,
			scrollStrategy: this.overlay.scrollStrategies.close(),
		});
	}

	barFocus() {
		if (this.cleanOnClick) {
			this.searchTerm.setValue('', { emitEvent: false });
			this.cleanOnClick = false;
		}
	}

	ngOnInit() {
		if (this.shouldFocus) {
			this.searchInputElementRef.nativeElement.focus();
		}

		this.buildSuggestionStrategy();

		this.router.events
			.pipe(
				takeUntil(this.$destroy),
				filter((event) => {
					return event instanceof NavigationStart && this.overlayRef.hasAttached();
				}),
			)
			.subscribe(() => {
				this.overlayRef.detach();
			});

		this.searchTerm.valueChanges.pipe(takeUntil(this.$destroy)).subscribe((query: string) => {
			if (query === '' && this.overlayRef.hasAttached()) {
				this.overlayRef.detach();
				return;
			} else if (query !== '') {
				this.searchQuery.next({ query, typeId: this.selectedSearchType });
				this.overlayRef.updateSize({
					width: this.searchFieldElementRef.nativeElement.clientWidth,
				});
				if (!this.overlayRef.hasAttached()) {
					const overlayInstance = this.overlayRef.attach(this.suggestionComponent);
					overlayInstance.instance.clickedOutside.pipe(takeUntil(this.$destroy)).subscribe((event) => {
						if (!this.searchFieldElementRef.nativeElement.contains(event.target)) {
							this.overlayRef.detach();
						}
					});
					overlayInstance.instance.selectedItem.pipe(takeUntil(this.$destroy)).subscribe((event) => {
						this.overlayRef.detach();
					});
				}
			}
		});
	}

	selectResult(item: SearchResult): void {
		this.router.navigate([ item.type === 'PHENOTYPE' ? 'phenotype' : 'gene', item.id ]).then(() => {
			this.searchInputElementRef.nativeElement.blur();
		});
	}

	selectSearchType(type: ISearchType) {
		this.selectedSearchType = type.id;
		this.searchQuery.next({ query: this.searchTerm.value, typeId: this.selectedSearchType });
	}

	ngOnDestroy() {
		this.$destroy.next();
		this.$destroy.unsubscribe();
	}
}
