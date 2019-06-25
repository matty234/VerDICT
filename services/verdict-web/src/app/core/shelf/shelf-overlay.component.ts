import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { Component, ElementRef, Injector, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { PathwaysComponent } from 'src/app/directory/gene/pathways/pathways.component';

import {
	EditCustomGeneGroupOverlayComponent,
	SHELF_VALUE_UID,
} from './edit-custom-gene-group/edit-custom-gene-group.component';
import { CustomGeneGroupShelfValue, StoredShelfValue } from './shelf.model';
import { ShelfService } from './shelf.service';

@Component({
	selector: 'app-shelf-overlay',
	templateUrl: './shelf-item.component.html',
	styleUrls: [ './shelf-item.component.scss' ],
})
export class ShelfOverlayComponent implements OnInit, OnDestroy {
	phenotypes: StoredShelfValue[] = [];
	$destroy = new Subject<void>();

	constructor(
		public shelfService: ShelfService,
		private overlay: Overlay,
		private injector: Injector,
		private router: Router,
	) {}

	drop(event: CdkDragDrop<StoredShelfValue>) {
		this.shelfService.dragDropArrange(event);
	}

	openNetwork() {
		this.router.navigate([ '/', 'network' ]);
	}

	openCardigan() {
		this.router.navigate([ '/', 'cardigan' ]);
	}

	delete(ssv: StoredShelfValue): void {
		const deletePhenotype = this.phenotypes.find((findPheno) => ssv === findPheno);
		if (deletePhenotype) {
			this.shelfService.delete(deletePhenotype);
		}
	}

	ngOnInit() {
		this.phenotypes = this.shelfService.get();
		this.shelfService.mutate$.pipe(takeUntil(this.$destroy)).subscribe(() => {
			this.phenotypes = this.shelfService.get();
		});
	}

	getGeneString(ssv: CustomGeneGroupShelfValue): string {
		return ssv.genes.map((gene) => gene.official_symbol).join(', ');
	}

	addGeneGroup() {
		this.shelfService.add(
			new CustomGeneGroupShelfValue({}),
		);
	}

	openEditGeneGroupOverlay(svUid: string): void {
		const getOverlayConfig = (): OverlayConfig => {
			const positionStrategy = this.overlay.position().global().centerHorizontally().centerVertically();
			const overlayConfig = new OverlayConfig({
				hasBackdrop: true,
				backdropClass: 'transparent-backdrop',
				scrollStrategy: this.overlay.scrollStrategies.close(),
				width: 300,
				positionStrategy,
				disposeOnNavigation: true,
			});
			return overlayConfig;
		};

		const createInjector = function(): PortalInjector {
			const injectorTokens = new WeakMap();
			injectorTokens.set(SHELF_VALUE_UID, svUid);
			return new PortalInjector(this.injector, injectorTokens);
		}.bind(this);

		const overlayRef = this.overlay.create(getOverlayConfig());
		const overlayComponent = new ComponentPortal(EditCustomGeneGroupOverlayComponent, null, createInjector());
		overlayRef.backdropClick().pipe(takeUntil(this.$destroy)).subscribe(() => {
			overlayRef.dispose();
		});
		const er = this.router.events
		.pipe(
			filter((event) => {
				return event instanceof NavigationStart;
			}),
		)
		.subscribe(() => {
			overlayRef.detach();
			er.unsubscribe();
		});
		overlayRef.attach(overlayComponent);
	}

	openPathwaySearch(): void {
		const getOverlayConfig = (): OverlayConfig => {
			const positionStrategy = this.overlay.position().global().centerHorizontally().centerVertically();

			const overlayConfig = new OverlayConfig({
				hasBackdrop: true,
				backdropClass: 'transparent-backdrop',
				scrollStrategy: this.overlay.scrollStrategies.close(),
				width: 300,
				positionStrategy,
			});

			return overlayConfig;
		};

		const createInjector = (): PortalInjector => {
			const injectorTokens = new WeakMap();
			return new PortalInjector(this.injector, injectorTokens);
		};

		const overlayRef = this.overlay.create(getOverlayConfig());
		const overlayComponent = new ComponentPortal(PathwaysComponent, null, createInjector());
		overlayRef.backdropClick().pipe(takeUntil(this.$destroy)).subscribe(() => {
			overlayRef.detach();
		});
		const attachedOverlay = overlayRef.attach(overlayComponent);
		attachedOverlay.instance.complete.pipe(takeUntil(this.$destroy)).subscribe(() => {
			overlayRef.detach();
		});
		this.router.events
			.pipe(
				takeUntil(this.$destroy),
				filter((event) => {
					return event instanceof NavigationStart && overlayRef.hasAttached();
				}),
			)
			.subscribe(() => {
				overlayRef.detach();
			});
	}

	ngOnDestroy() {
		this.$destroy.next();
		this.$destroy.unsubscribe();
	}
}
