import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material';
import { RouterModule } from '@angular/router';

import { CoreModule } from '../core/core.module';
import { MaterialModule } from '../material.module';
import { AddMultipleShelfDialogComponent } from './add-multiple-shelf-dialog/add-multiple-shelf-dialog-button.component';
import {
	AddMultipleShelfDialogComponentOverlayComponent,
} from './add-multiple-shelf-dialog/add-multiple-shelf-dialog.component';
import { DirectoryComponent } from './directory.component';
import { GeneBelongsToPhenotypesComponent } from './gene-belongs-to-phenotypes/gene-belongs-to-phenotypes.component';
import { GeneInteractsWithComponent } from './gene-interacts-with/gene-interacts-with.component';
import { AddToGeneGroupComponent } from './gene/add-to-gene-group/add-to-gene-group.component';
import { GeneComponent } from './gene/gene.component';
import { PathwaysComponent } from './gene/pathways/pathways.component';
import { HasGenesComponent } from './has-genes/has-genes.component';
import { PathwayListComponent } from './pathway-list/pathway-list.component';
import { PhenotypeComponent, PhenotypeNameComponent } from './phenotype/phenotype.component';

@NgModule({
	entryComponents: [ AddMultipleShelfDialogComponentOverlayComponent, AddToGeneGroupComponent ],
	imports: [ CommonModule, MaterialModule, RouterModule, CoreModule, FormsModule, ReactiveFormsModule, MatButtonModule ],
	exports: [ PhenotypeNameComponent, PathwaysComponent ],
	declarations: [
		DirectoryComponent,
		PhenotypeComponent,
		PhenotypeNameComponent,
		HasGenesComponent,
		GeneComponent,
		GeneInteractsWithComponent,
		GeneBelongsToPhenotypesComponent,
		AddMultipleShelfDialogComponentOverlayComponent,
		AddMultipleShelfDialogComponent,
		AddToGeneGroupComponent,
		PathwaysComponent,
		PathwayListComponent,
	],
})
export class DirectoryModule {}
