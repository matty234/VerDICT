import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { GeneService } from '../gene/gene.service';
import { MockGeneService } from '../gene/gene.service.mock';
import { GeneBelongsToPhenotypesComponent } from './gene-belongs-to-phenotypes.component';

describe('GeneBelongsToPhenotypesComponent', () => {
	let component: GeneBelongsToPhenotypesComponent;
	let fixture: ComponentFixture<GeneBelongsToPhenotypesComponent>;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [ GeneBelongsToPhenotypesComponent ],
				schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
				providers: [
					{
						provide: GeneService,
						useClass: MockGeneService,
					},
				],
			}).compileComponents();
		}),
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(GeneBelongsToPhenotypesComponent);
		component = fixture.componentInstance;
		component.gene = of(123);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
