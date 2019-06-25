
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { MatBottomSheetModule } from '@angular/material';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NavComponent } from './nav.component';

describe('NavComponent', () => {
	let component: NavComponent;
	let fixture: ComponentFixture<NavComponent>;

	beforeEach(fakeAsync(() => {
		TestBed.configureTestingModule({
			imports: [MatSidenavModule, RouterTestingModule, MatBottomSheetModule, BrowserAnimationsModule],
			declarations: [NavComponent],
			schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
		})
		.compileComponents();

		fixture = TestBed.createComponent(NavComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should compile', () => {
		expect(component).toBeTruthy();
	});
});
