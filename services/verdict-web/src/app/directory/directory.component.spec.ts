import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectoryComponent } from './directory.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('DirectoryComponent', () => {
	let component: DirectoryComponent;
	let fixture: ComponentFixture<DirectoryComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ DirectoryComponent ],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			imports: [RouterTestingModule.withRoutes([])]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DirectoryComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
