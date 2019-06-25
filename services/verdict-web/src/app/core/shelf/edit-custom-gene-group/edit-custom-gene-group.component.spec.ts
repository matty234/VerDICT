import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ShelfService } from '../shelf.service';
import { MockShelfService } from '../shelf.service.mock';
import { EditCustomGeneGroupOverlayComponent, SHELF_VALUE_UID } from './edit-custom-gene-group.component';

describe('EditCustomGeneGroupOverlayComponent', () => {
	let component: EditCustomGeneGroupOverlayComponent;
	let fixture: ComponentFixture<EditCustomGeneGroupOverlayComponent>;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [ EditCustomGeneGroupOverlayComponent ],
				imports: [],
				providers: [
					{
						provide: SHELF_VALUE_UID,
						useValue: 't-123',
					},
					{
						provide: ShelfService,
						useClass: MockShelfService,
					},
				],
				schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
			}).compileComponents();
		}),
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(EditCustomGeneGroupOverlayComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
