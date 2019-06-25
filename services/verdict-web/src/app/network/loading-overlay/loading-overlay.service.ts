import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoadingOverlayComponent } from './loading-overlay.component';

@Injectable({
	providedIn: 'root',
})
export class LoadingOverlayService implements OnDestroy {
	overlayRef: OverlayRef = null;
	$destroy = new Subject<void>();

	constructor(private overlay: Overlay) {}

	open(): void {
		const getOverlayConfig = (): OverlayConfig => {
			const positionStrategy = this.overlay.position().global().centerHorizontally().centerVertically();
			const overlayConfig = new OverlayConfig({
				hasBackdrop: true,
				scrollStrategy: this.overlay.scrollStrategies.block(),
				positionStrategy,
				disposeOnNavigation: true,
			});
			return overlayConfig;
		};

		this.overlayRef = this.overlay.create(getOverlayConfig());
		const overlayComponent = new ComponentPortal(LoadingOverlayComponent, null, null);
		this.overlayRef.attach(overlayComponent);
	}

	close(): void {
		if (this.overlayRef) {
			this.overlayRef.dispose();
			this.overlayRef = null;
		}
	}

	ngOnDestroy() {
		this.$destroy.next();
		this.$destroy.unsubscribe();
	}
}
