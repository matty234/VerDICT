import { TestBed } from '@angular/core/testing';

import { SearchService } from './search.service';

describe('SearchService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			providers: [],
		}),
	);

	it('should be created', () => {
		const service: SearchService = TestBed.get(SearchService);
		expect(service).toBeTruthy();
	});
});
