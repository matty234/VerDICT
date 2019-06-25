import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhenotypeForGeneComponent, TARGET_GENE_ENTREZ } from './phenotype-for-gene.component';

describe('PhenotypeForGeneComponent', () => {
	let component: PhenotypeForGeneComponent;
	let fixture: ComponentFixture<PhenotypeForGeneComponent>;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [ PhenotypeForGeneComponent ],
				schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
				providers: [
					{
						provide: TARGET_GENE_ENTREZ,
						useValue: 219700,
					},
				],
			}).compileComponents();
		}),
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(PhenotypeForGeneComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
