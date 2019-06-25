import { NoopScrollStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { Component, ElementRef, InjectionToken, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PHENOTYPE_ID, ShelfItemSettingsOverlayComponent } from './shelf-item-settings.overlay.component';

@Component({
	selector: 'app-shelf-item-settings',
	templateUrl: './shelf-item-settings.component.html',
	styleUrls: [ './shelf-item-settings.component.css' ],
})
export class ShelfItemSettingsComponent implements OnInit, OnDestroy {
	private destroy$ = new Subject<void>();
	private detach$ = new Subject<void>().pipe(takeUntil(this.destroy$));

	@Input() id = '';
	private overlayComponent: ComponentPortal<ShelfItemSettingsOverlayComponent>;

	overlayRef: OverlayRef;

	constructor(private overlay: Overlay, private elementRef: ElementRef, private injector: Injector) {}

	ngOnInit() {
		this.overlayComponent = new ComponentPortal(
			ShelfItemSettingsOverlayComponent,
			null,
			this.createInjector(this.id),
		);
		const positionStrategy = this.overlay
			.position()
			.flexibleConnectedTo(this.elementRef)
			.withFlexibleDimensions(true)
			.withPositions([
				{
					originX: 'end',
					originY: 'top',
					overlayX: 'start',
					overlayY: 'bottom',
				},
			]);
		this.overlayRef = this.overlay.create({
			hasBackdrop: true,
			backdropClass: 'transparent-backdrop',
			positionStrategy,
			scrollStrategy: new NoopScrollStrategy(),
		});
		this.overlayRef.backdropClick().pipe(takeUntil(this.destroy$)).subscribe(() => this.close());
	}

	createInjector(id: string): PortalInjector {
		const injectorTokens = new WeakMap();
		injectorTokens.set(PHENOTYPE_ID, id);
		return new PortalInjector(this.injector, injectorTokens);
	}

	close() {
		(this.detach$ as Subject<void>).next();
		this.overlayRef.detach();
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.unsubscribe();
	}

	open() {
		this.overlayRef.attach(this.overlayComponent);
	}
}
