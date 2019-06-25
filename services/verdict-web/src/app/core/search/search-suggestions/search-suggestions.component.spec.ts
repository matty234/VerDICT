import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PhenotypeNamePipe } from '../../phenotype-name.pipe';
import { SEARCH_QUERY, SearchSuggestionsComponent } from './search-suggestions.component';

describe('SearchSuggestionsComponent', () => {
	let component: SearchSuggestionsComponent;
	let fixture: ComponentFixture<SearchSuggestionsComponent>;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [ PhenotypeNamePipe, SearchSuggestionsComponent ],
				imports: [ RouterTestingModule.withRoutes([]) ],
				providers: [
					{
						provide: SEARCH_QUERY,
						useValue: of('test'),
					},
				],
				schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
			}).compileComponents();
		}),
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(SearchSuggestionsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
