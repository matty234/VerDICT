import { OverlayModule } from '@angular/cdk/overlay';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';

import { PhenotypeNamePipe } from '../core/phenotype-name.pipe';
import { TargetExplorerComponent } from './target-explorer.component';

describe('TargetExplorerComponent', () => {
	let component: TargetExplorerComponent;
	let fixture: ComponentFixture<TargetExplorerComponent>;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				imports: [ ReactiveFormsModule, FormsModule, OverlayModule ],
				declarations: [ TargetExplorerComponent, PhenotypeNamePipe ],
				schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
				providers: [ ScrollToService ],
			}).compileComponents();
		}),
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(TargetExplorerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
