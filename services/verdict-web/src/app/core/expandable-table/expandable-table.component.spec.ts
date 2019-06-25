import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ExpandableTableComponent } from './expandable-table.component';

describe('ExpandableTableComponent', () => {
	let component: ExpandableTableComponent;
	let fixture: ComponentFixture<ExpandableTableComponent>;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				schemas: [CUSTOM_ELEMENTS_SCHEMA],
				imports: [RouterTestingModule.withRoutes([])],
				declarations: [ ExpandableTableComponent ],
			}).compileComponents();
		}),
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(ExpandableTableComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
