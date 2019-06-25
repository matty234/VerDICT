import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule, MatSelectModule } from '@angular/material';
import { CoreModule } from '../core/core.module';
import { MaterialModule } from '../material.module';
import { TargetExplorerModule } from '../target-explorer/target-explorer.module';
import { LoadingOverlayComponent } from './loading-overlay/loading-overlay.component';
import { NetworkComponent } from './network.component';
import { Materials } from './network.materials';
import { NodeDetailsComponent } from './node-details/node-details.component';

@NgModule({
	entryComponents: [
		LoadingOverlayComponent,
		NodeDetailsComponent,
	],

	imports: [
		CommonModule,
		CoreModule,
		MaterialModule,
		FormsModule,
		TargetExplorerModule,
		MatSelectModule,
		MatProgressSpinnerModule,
	],
	declarations: [ NetworkComponent, LoadingOverlayComponent, NodeDetailsComponent ],
})
export class NetworkModule {}
