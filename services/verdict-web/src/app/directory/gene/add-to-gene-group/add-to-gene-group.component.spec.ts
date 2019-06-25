import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToGeneGroupComponent, GENE_INJECTION_TOKEN } from './add-to-gene-group.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Gene } from '../gene.model';
import { MatSnackBarModule } from '@angular/material';

describe('AddToGeneGroupComponent', () => {
	let component: AddToGeneGroupComponent;
	let fixture: ComponentFixture<AddToGeneGroupComponent>;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [ AddToGeneGroupComponent ],
				imports: [MatSnackBarModule],
				schemas: [CUSTOM_ELEMENTS_SCHEMA],
				providers: [
					{
						provide: GENE_INJECTION_TOKEN,
						useValue: new Gene({
							entrez: 123,
							official_symbol: 'test'
						})
					}
				]
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(AddToGeneGroupComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
