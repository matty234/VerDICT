import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule, MatChipsModule, MatListModule, MatProgressSpinnerModule } from '@angular/material';

import { CoreModule } from '../core/core.module';
import { DirectoryModule } from '../directory/directory.module';
import { MaterialModule } from '../material.module';
import { PhenotypeForGeneComponent } from './phenotype-for-gene/phenotype-for-gene.component';
import { TargetExplorerComponent } from './target-explorer.component';

@NgModule({
	imports: [
	CommonModule,
		CoreModule,
		MatCardModule,
		MatChipsModule,
		MatListModule,
		DirectoryModule,
		MaterialModule,
		FormsModule,
		MatProgressSpinnerModule,
		ReactiveFormsModule,
	],
	entryComponents: [PhenotypeForGeneComponent],
	exports: [ TargetExplorerComponent ],
	declarations: [ TargetExplorerComponent, PhenotypeForGeneComponent ],
})
export class TargetExplorerModule {}
