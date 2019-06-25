import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryLoadingBarComponent } from './query-loading-bar.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('QueryLoadingBarComponent', () => {
	let component: QueryLoadingBarComponent;
	let fixture: ComponentFixture<QueryLoadingBarComponent>;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [ QueryLoadingBarComponent ],
				schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(QueryLoadingBarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
