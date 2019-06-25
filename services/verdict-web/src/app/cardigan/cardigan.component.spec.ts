import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { MaterialModule } from '../material.module';
import { CardiganComponent } from './cardigan.component';

xdescribe('CardiganComponent', () => {
	let component: CardiganComponent;
	let fixture: ComponentFixture<CardiganComponent>;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [ CardiganComponent ],
				imports: [ CoreModule ],
				schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
			}).compileComponents();
		}),
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(CardiganComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
