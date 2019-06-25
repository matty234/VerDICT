import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { LayoutModule } from '@angular/cdk/layout';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CoreModule } from '../core/core.module';
import { DirectoryModule } from '../directory/directory.module';
import { MaterialModule } from '../material.module';
import { HomeComponent } from './home.component';
import { ImporterComponent } from './importer/importer.component';
import { WelcomeCardComponent } from './welcome-card/welcome-card.component';

@NgModule({
	imports: [
		CommonModule,
		LayoutModule,
		MaterialModule,
		ReactiveFormsModule,
		RouterModule,
		DragDropModule,
		CoreModule,
		CdkStepperModule,
		DirectoryModule,
	],
	exports: [ HomeComponent, WelcomeCardComponent ],
	declarations: [
		WelcomeCardComponent,
		HomeComponent,
		ImporterComponent,
	],
})
export class HomeModule {}
