import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PhenotypeNamePipe } from '../../core/phenotype-name.pipe';
import { PhenotypeComponent } from './phenotype.component';

describe('PhenotypeComponent', () => {
	let component: PhenotypeComponent;
	let fixture: ComponentFixture<PhenotypeComponent>;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [ PhenotypeComponent, PhenotypeNamePipe ],
				providers: [],
				schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
			}).compileComponents();
		}),
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(PhenotypeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
