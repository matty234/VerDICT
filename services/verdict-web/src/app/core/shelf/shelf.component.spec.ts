import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelfComponent } from './shelf.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { RouterTestingModule } from '@angular/router/testing';

describe('ShelfComponent', () => {
	let component: ShelfComponent;
	let fixture: ComponentFixture<ShelfComponent>;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [ ShelfComponent ],
				imports: [OverlayModule, RouterTestingModule.withRoutes([])]
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(ShelfComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
