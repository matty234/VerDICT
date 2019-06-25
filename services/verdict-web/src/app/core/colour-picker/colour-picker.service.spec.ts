import { TestBed } from '@angular/core/testing';

import { ColourPickerService } from './colour-picker.service';

describe('ColourPickerService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: ColourPickerService = TestBed.get(ColourPickerService);
		expect(service).toBeTruthy();
	});
});
