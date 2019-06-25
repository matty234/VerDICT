import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HasGenesComponent } from './has-genes.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('HasGenesComponent', () => {
	let component: HasGenesComponent;
	let fixture: ComponentFixture<HasGenesComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [HasGenesComponent],
			imports: [],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(HasGenesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
