import { NoopScrollStrategy, Overlay } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ElementRef, Injectable, InjectionToken, Injector, OnDestroy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, skip, takeUntil } from 'rxjs/operators';
import { Gene } from '../../directory/gene/gene.model';
import { NODE_INJECTION_TOKEN, NodeDetailsComponent } from './node-details.component';

@Injectable({
	providedIn: 'root',
})
export class NodeDetailsService implements OnDestroy {
	destroy$ = new Subject<void>();

	constructor(private overlay: Overlay, private injector: Injector, private router: Router) {}

	public openNodeDetails(gene: Gene): void {
		const createInjector = (): PortalInjector => {
			const injectorTokens = new WeakMap();
			injectorTokens.set(NODE_INJECTION_TOKEN, gene);
			return new PortalInjector(this.injector, injectorTokens);
		};

		function close() {
			overlayRef.dispose();
		}

		const overlayComponent: ComponentPortal<NodeDetailsComponent> = new ComponentPortal(
			NodeDetailsComponent,
			null,
			createInjector(),
		);
		const positionStrategy = this.overlay.position().global().centerHorizontally().bottom();

		const overlayRef = this.overlay.create({
			hasBackdrop: false,
			positionStrategy,
			minWidth: '20em',
			maxWidth: '100%',
			scrollStrategy: new NoopScrollStrategy(),
		});
		const attached = overlayRef.attach(overlayComponent);
		overlayRef.backdropClick().pipe(takeUntil(this.destroy$)).subscribe(close);
		attached.instance.shouldClose.pipe(skip(1), takeUntil(this.destroy$)).subscribe(close);
		this.router.events
			.pipe(
				takeUntil(this.destroy$),
				filter((event) => {
					return event instanceof NavigationStart;
				}),
			)
			.subscribe(close);
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.unsubscribe();
	}
}
