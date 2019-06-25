import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddMultipleShelfDialogComponent } from './add-multiple-shelf-dialog-button.component';
import { OverlayModule } from '@angular/cdk/overlay';


describe('AddMultipleShelfDialogComponent', () => {
	let component: AddMultipleShelfDialogComponent;
	let fixture: ComponentFixture<AddMultipleShelfDialogComponent>;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [ AddMultipleShelfDialogComponent ],
				imports: [OverlayModule]
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(AddMultipleShelfDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
