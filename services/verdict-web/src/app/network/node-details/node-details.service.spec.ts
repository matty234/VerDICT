import { TestBed } from '@angular/core/testing';

import { NodeDetailsService } from './node-details.service';

describe('NodeDetailsService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: NodeDetailsService = TestBed.get(NodeDetailsService);
		expect(service).toBeTruthy();
	});
});
