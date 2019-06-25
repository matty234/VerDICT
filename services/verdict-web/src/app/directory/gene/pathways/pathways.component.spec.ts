import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { PathwaysComponent } from './pathways.component';

describe('PathwaysComponent', () => {
	let component: PathwaysComponent;
	let fixture: ComponentFixture<PathwaysComponent>;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [ PathwaysComponent ],
				imports: [ ReactiveFormsModule, HttpClientTestingModule ],
				providers: [],
				schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
			}).compileComponents();
		}),
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(PathwaysComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
