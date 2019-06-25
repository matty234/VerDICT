import { OverlayModule } from '@angular/cdk/overlay';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { GeneComponent } from './gene.component';

describe('GeneComponent', () => {
	let component: GeneComponent;
	let fixture: ComponentFixture<GeneComponent>;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [ GeneComponent ],
				imports: [ OverlayModule ],
				schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
				providers: [],
			}).compileComponents();
		}),
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(GeneComponent);
		component = fixture.componentInstance;
		component.selectedGene = of(123);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
