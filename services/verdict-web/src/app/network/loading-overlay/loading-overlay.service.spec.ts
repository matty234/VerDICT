import { TestBed } from '@angular/core/testing';

import { LoadingOverlayService } from './loading-overlay.service';
import { OverlayModule } from '@angular/cdk/overlay';

describe('LoadingOverlayServiceService', () => {
	beforeEach(() => TestBed.configureTestingModule({
		imports: [
			OverlayModule
		]
	}));

	it('should be created', () => {
		const service: LoadingOverlayService = TestBed.get(LoadingOverlayService);
		expect(service).toBeTruthy();
	});
});
