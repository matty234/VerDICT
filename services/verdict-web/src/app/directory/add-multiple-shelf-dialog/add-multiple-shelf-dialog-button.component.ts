import { NoopScrollStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { noop } from '@angular/compiler/src/render3/view/util';
import { Component, Inject, InjectionToken, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { flatMap, takeUntil, tap } from 'rxjs/operators';
import { ShelfService } from '../../core/shelf/shelf.service';
import { PhenotypeService } from '../phenotype/phenotype.service';
import { AddMultipleShelfDialogComponentOverlayComponent, PHENOTYPE_ID } from './add-multiple-shelf-dialog.component';

@Component({
	selector: 'app-add-multiple-shelf-dialog-button',
	template: `
							<button mat-stroked-button color="primary" (click)="open()" class="add-mult-button">Add Multiple</button>
						`,
	styles: [ `` ],
})
export class AddMultipleShelfDialogComponent implements OnInit, OnDestroy {
	private overlayComponent: ComponentPortal<AddMultipleShelfDialogComponentOverlayComponent>;

	overlayRef: OverlayRef;

	$destroy = new Subject<void>();

	@Input() id = 219700;

	constructor(private overlay: Overlay, private injector: Injector) {}

	ngOnInit() {
		this.overlayComponent = new ComponentPortal(
			AddMultipleShelfDialogComponentOverlayComponent,
			null,
			this.createInjector(),
		);
		const positionStrategy = this.overlay.position().global().centerHorizontally().centerVertically();
		this.overlayRef = this.overlay.create({
			hasBackdrop: true,
			positionStrategy,
			scrollStrategy: new NoopScrollStrategy(),
		});
		this.overlayRef.backdropClick().pipe(takeUntil(this.$destroy)).subscribe(() => this.close());
	}

	close() {
		this.overlayRef.detach();
	}

	createInjector(): PortalInjector {
		const injectorTokens = new WeakMap();
		injectorTokens.set(PHENOTYPE_ID, this.id);
		return new PortalInjector(this.injector, injectorTokens);
	}

	open() {
		const compRef = this.overlayRef.attach(this.overlayComponent);
		compRef.instance.onModalClose().pipe(takeUntil(this.$destroy)).subscribe(() => this.close());
	}
	ngOnDestroy() {
	this.$destroy.next();
	this.$destroy.unsubscribe();
	}
}
