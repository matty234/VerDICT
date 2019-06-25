import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material.module';
import { CsvImportComponent } from './csv-import.component';

describe('CsvImportComponent', () => {
	let component: CsvImportComponent;
	let fixture: ComponentFixture<CsvImportComponent>;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [ CsvImportComponent ],
				imports: [ MaterialModule, NoopAnimationsModule ],
				providers: [],
				schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
			}).compileComponents();
		}),
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(CsvImportComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
