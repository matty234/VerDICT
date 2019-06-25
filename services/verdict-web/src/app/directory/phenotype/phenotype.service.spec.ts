import { TestBed } from '@angular/core/testing';

import { PhenotypeService } from './phenotype.service';

describe('PhenotypeService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			providers: [],
		}),
	);

	it('should be created', () => {
		const service: PhenotypeService = TestBed.get(PhenotypeService);
		expect(service).toBeTruthy();
	});
});
