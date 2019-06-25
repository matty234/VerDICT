import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { GeneInteractsWithComponent } from './gene-interacts-with.component';

describe('GeneInteractsWithComponent', () => {
	let component: GeneInteractsWithComponent;
	let fixture: ComponentFixture<GeneInteractsWithComponent>;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [ GeneInteractsWithComponent ],
				schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
				providers: [],
			}).compileComponents();
		}),
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(GeneInteractsWithComponent);
		component = fixture.componentInstance;
		component.gene = of(123);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
