import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { ShelfOverlayComponent } from './shelf-overlay.component';
import { StoredShelfValue } from './shelf.model';
import { ShelfService } from './shelf.service';

@Component({
	selector: 'app-shelf',
	template: `<span (click)="openSheet()"><ng-content></ng-content></span>`,
})
export class ShelfComponent implements OnInit, OnDestroy {
	@Input() value: StoredShelfValue;

	$destroy = new Subject<void>();
	private overlayRef: OverlayRef;
	private shelfOpenComponent: ComponentPortal<ShelfOverlayComponent>;

	constructor(private shelfService: ShelfService, private overlay: Overlay, private router: Router) {}

	ngOnInit() {
		this.overlayRef = this.overlay.create(this.getOverlayConfig());
		this.shelfOpenComponent = new ComponentPortal(ShelfOverlayComponent);
		this.overlayRef.backdropClick().pipe(takeUntil(this.$destroy)).subscribe(() => {
			this.overlayRef.detach();
		});
		this.router.events
			.pipe(
				takeUntil(this.$destroy),
				filter((event) => {
					return event instanceof NavigationStart;
				}),
			)
			.subscribe(() => {
				this.overlayRef.detach();
			});
	}

	openSheet(): void {
		if (this.value) {
			this.shelfService.add(this.value);
		}
		this.overlayRef.attach(this.shelfOpenComponent);
	}

	private getOverlayConfig(): OverlayConfig {
		const positionStrategy = this.overlay.position().global().bottom().centerHorizontally();

		const overlayConfig = new OverlayConfig({
			hasBackdrop: true,
			backdropClass: 'cdk-overlay-dark-backdrop',
			panelClass: 'shelf-overlay',
			scrollStrategy: this.overlay.scrollStrategies.close(),
			positionStrategy,
			width: '100%',
			disposeOnNavigation: true,
		});

		return overlayConfig;
	}

	ngOnDestroy() {
		this.$destroy.next();
		this.$destroy.unsubscribe();
	}
}
