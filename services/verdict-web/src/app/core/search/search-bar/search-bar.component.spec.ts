import { OverlayModule } from '@angular/cdk/overlay';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { SearchBarComponent } from './search-bar.component';

describe('SearchBarComponent', () => {
	let component: SearchBarComponent;
	let fixture: ComponentFixture<SearchBarComponent>;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
				imports: [ ReactiveFormsModule, RouterTestingModule.withRoutes([]), OverlayModule ],

				providers: [
				],
				declarations: [ SearchBarComponent ],
			}).compileComponents();
		}),
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(SearchBarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
