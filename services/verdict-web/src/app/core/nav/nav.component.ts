import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet, MatSidenav } from '@angular/material';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, map, takeUntil, tap, withLatestFrom } from 'rxjs/operators';

import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { SettingsComponent } from 'src/app/settings/settings.component';
import { QueryLoadingBarService } from '../query-loading-bar/query-loading-bar.service';
import { ShelfOverlayComponent } from '../shelf/shelf-overlay.component';
import { ShelfService } from '../shelf/shelf.service';

/**
* Provides simple navigation around the site
*/
@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
	styleUrls: [ './nav.component.scss' ],
})
export class NavComponent implements OnDestroy, OnInit {
	static IS_DRAWER_OPEN: BehaviorSubject<boolean>;

	@ViewChild('drawer') drawer: MatSidenav;

	isHandset$: BehaviorSubject<boolean> = new BehaviorSubject(
		this.breakpointObserver.isMatched([ Breakpoints.Handset, Breakpoints.Tablet ]),
	);
	$destroy = new Subject<void>();

	constructor(
		private breakpointObserver: BreakpointObserver,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private qlbs: QueryLoadingBarService,
		private bottomSheet: MatBottomSheet,
		private overlay: Overlay,
	) {
		const routeEvents = this.router.events;
		this.breakpointObserver
			.observe([ Breakpoints.Handset, Breakpoints.Tablet ])
			.pipe(map((result) => result.matches))
			.subscribe((result) => {
				this.isHandset$.next(result);
			});

		this.isHandset$.pipe(takeUntil(this.$destroy)).subscribe((v) => {
			NavComponent.IS_DRAWER_OPEN = new BehaviorSubject<boolean>(v);
		});

		routeEvents
			.pipe(
				takeUntil(this.$destroy),
				withLatestFrom(this.isHandset$),
				filter(([ a, b ]) => b && a instanceof NavigationEnd),
			)
			.subscribe(() => {
				this.drawer.close();
			});

		routeEvents
			.pipe(
				takeUntil(this.$destroy),
				filter((event) => {
					return event instanceof NavigationStart;
				}),
			)
			.subscribe((e) => {
				qlbs.show();
			});

		routeEvents
			.pipe(
				takeUntil(this.$destroy),
				filter((event) => {
					return event instanceof NavigationEnd;
				}),
			)
			.subscribe((e) => {
				qlbs.hide();
			});
	}

	ngOnInit() {
		this.drawer.openedChange.asObservable().pipe(takeUntil(this.$destroy)).subscribe((e) => {
			NavComponent.IS_DRAWER_OPEN.next(e);
		});
	}

	showSpinner(): void {
		this.qlbs.show();
	}

	openShelf(): void {
		this.bottomSheet.open(ShelfOverlayComponent);
		this.isHandset$.pipe(takeUntil(this.$destroy)).subscribe((result) => {
			if (result) {
				this.drawer.close();
			}
		});
	}

	ngOnDestroy() {
		this.$destroy.next();
		this.$destroy.unsubscribe();
	}

	openSettings(): void {
		const getOverlayConfig = function(): OverlayConfig {
			const positionStrategy = this.overlay.position().global().centerHorizontally().centerVertically();

			const overlayConfig = new OverlayConfig({
				hasBackdrop: true,
				scrollStrategy: this.overlay.scrollStrategies.close(),
				width: 500,
				positionStrategy,
			});

			return overlayConfig;
		}.bind(this);

		const createInjector = function(uid: string): PortalInjector {
			const injectorTokens = new WeakMap();
			return new PortalInjector(this.injector, injectorTokens);
		}.bind(this);

		const overlayRef = this.overlay.create(getOverlayConfig());
		const overlayComponent = new ComponentPortal(SettingsComponent, null, createInjector());
		overlayRef.backdropClick().pipe(takeUntil(this.$destroy)).subscribe(() => {
			overlayRef.detach();
		});
		this.router.events
			.pipe(
				takeUntil(this.$destroy),
				filter((event) => {
					return event instanceof NavigationStart;
				}),
			)
			.subscribe(() => {
				overlayRef.detach();
			});
		overlayRef.attach(overlayComponent);
	}
}
