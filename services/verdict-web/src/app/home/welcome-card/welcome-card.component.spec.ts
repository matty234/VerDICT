import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeCardComponent } from './welcome-card.component';

describe('WelcomeCardComponent', () => {
	let component: WelcomeCardComponent;
	let fixture: ComponentFixture<WelcomeCardComponent>;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [ WelcomeCardComponent ],
				schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
				providers: [],
			}).compileComponents();
		}),
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(WelcomeCardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
