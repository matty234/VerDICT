import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { PathwaysService } from './pathways.service';

describe('PathwaysService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [ HttpClientTestingModule ],
			providers: [],
		}),
	);

	it('should be created', () => {
		const service: PathwaysService = TestBed.get(PathwaysService);
		expect(service).toBeTruthy();
	});
});
