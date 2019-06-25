import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-loading-overlay',
	templateUrl: './loading-overlay.component.html',
	styleUrls: [ './loading-overlay.component.css' ],
})
export class LoadingOverlayComponent implements OnInit {
	constructor() {}

	ngOnInit() {}

}
