import { TestBed } from '@angular/core/testing';

import { GeneService } from './gene.service';

describe('GeneService', () => {
	let service: GeneService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [],
		});
		service = TestBed.get(GeneService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
