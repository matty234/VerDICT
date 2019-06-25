import { TestBed } from '@angular/core/testing';

import { QueryLoadingBarService } from './query-loading-bar.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

describe('QueryLoadingBarService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [ MatProgressBarModule ],
			schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
		})
	);

	it('should be created', () => {
		const service: QueryLoadingBarService = TestBed.get(QueryLoadingBarService);
		expect(service).toBeTruthy();
	});
});
