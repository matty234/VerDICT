import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatCardModule, MatSnackBarModule } from '@angular/material';
import { MaterialModule } from '../material.module';
import { SettingsComponent } from './settings.component';

@NgModule({
	imports: [ CommonModule, MatCardModule, MatSnackBarModule, MatButtonModule ],
	exports: [ SettingsComponent ],
	entryComponents: [ SettingsComponent ],
	declarations: [ SettingsComponent ],
})
export class SettingsModule {}
