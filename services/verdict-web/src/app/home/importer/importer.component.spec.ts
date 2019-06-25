import { CdkStepper, StepperSelectionEvent } from '@angular/cdk/stepper';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImporterComponent } from './importer.component';

describe('ImporterComponent', () => {
	let component: ImporterComponent;
	let fixture: ComponentFixture<ImporterComponent>;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [ ImporterComponent ],
				schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
				providers: [],
			}).compileComponents();
		}),
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(ImporterComponent);
		component = fixture.componentInstance;
		component.stepper = {
			selectionChange: new EventEmitter<StepperSelectionEvent>(),
		} as CdkStepper;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
