import {
	ChangeDetectorRef,
	Component,
	ContentChild,
	Input,
	NgZone,
	OnChanges,
	OnDestroy,
	OnInit,
	TemplateRef,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { isObservable, Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { GeneItemDirective } from '../gene-item.directive';
import { PhenotypeItemDirective } from '../phenotype-item.directive';
import { TitleButtonsDirective } from './title-buttons.directive';

@Component({
	selector: 'app-expandable-table',
	templateUrl: './expandable-table.component.html',
	styleUrls: [ './expandable-table.component.css' ],
})
export class ExpandableTableComponent implements OnInit, OnChanges, OnDestroy {
	@Input() title: string;
	@Input() showAll = false;
	@Input() loadingOnRouteChange = false;

	private limit = 4;
	private _items: any[] = [];

	$destroy = new Subject<void>();
	isLoading = true;

	@Input()
	set items(newItems: any[] | Array<Observable<any>>) {
		if (isObservable<any[]>(newItems)) {
			this.isLoading = true;
			newItems.pipe(takeUntil(this.$destroy)).subscribe((items) => {
				this.items = items;
			});
		} else {
			this.isLoading = false;
			this._items = newItems;
			if (this.items.length <= this.limit || this.showAll) {
				this.isShowingMore = true;
				this.itemsShort = [];
			} else {
				this.isShowingMore = false;
				this.itemsShort = newItems.slice(0, this.limit);
			}
			this.cd.detectChanges();
		}
	}

	get items(): any[] | Array<Observable<any>> {
		return this._items;
	}

	itemsShort: any[] = [];

	@Input() type: 'phenotype' | 'gene' = 'gene';

	@ContentChild(GeneItemDirective, { read: TemplateRef })
	geneItemTemplate;
	@ContentChild(PhenotypeItemDirective, { read: TemplateRef })
	phenotypeItemTemplate;
	@ContentChild(TitleButtonsDirective, { read: TemplateRef })
	titleButtonsTemplate;

	constructor(private ngZone: NgZone, private router: Router, private cd: ChangeDetectorRef) {}

	isShowingMore = false;

	ngOnInit() {
		if (this.loadingOnRouteChange) {
			this.router.events
				.pipe(
					takeUntil(this.$destroy),
					filter((event) => {
						return event instanceof NavigationEnd;
					}),
				)
				.subscribe(() => {
					this.isLoading = true;
				});
		}
	}

	open(type: 'PHENOTYPE' | 'GENE', id: number) {
		this.router.navigate([ type === 'PHENOTYPE' ? 'phenotype' : 'gene', id ]);
	}

	ngOnChanges() {}

	showMore() {
		this.isShowingMore = true;
		this.cd.detectChanges();
	}

	ngOnDestroy() {
		this.$destroy.next();
		this.$destroy.unsubscribe();
	}
}
