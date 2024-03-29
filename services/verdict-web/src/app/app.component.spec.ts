import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
describe('AppComponent', () => {
	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [ AppComponent ],
				schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
			}).compileComponents();
		}),
	);
	it(
		'should create the app',
		async(() => {
			const fixture = TestBed.createComponent(AppComponent);
			const app = fixture.debugElement.componentInstance;
			expect(app).toBeTruthy();
		}),
	);
	it(
		`should have as title 'Paccanaro Lab'`,
		async(() => {
			const fixture = TestBed.createComponent(AppComponent);
			const app = fixture.debugElement.componentInstance;
			expect(app.title).toEqual('Paccanaro Lab');
		}),
	);
});
