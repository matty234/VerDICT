import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColourPickerOverlayComponent } from './colour-picker-overlay.component';

describe('ColourPickerOverlayComponent', () => {
	let component: ColourPickerOverlayComponent;
	let fixture: ComponentFixture<ColourPickerOverlayComponent>;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [ ColourPickerOverlayComponent ],
			}).compileComponents();
		}),
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(ColourPickerOverlayComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
