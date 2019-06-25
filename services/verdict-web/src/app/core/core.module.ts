import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { PathwaysComponent } from 'src/app/directory/gene/pathways/pathways.component';
import { MaterialModule } from '../material.module';
import { SettingsComponent } from '../settings/settings.component';
import { SettingsModule } from '../settings/settings.module';
import { AutoFocusDirective } from './auto-focus.directive';
import { ColourPickerOverlayComponent } from './colour-picker/colour-picker-overlay.component';
import { CsvImportComponent } from './csv-import/csv-import.component';
import { ExpandableTableComponent } from './expandable-table/expandable-table.component';
import { TitleButtonsDirective } from './expandable-table/title-buttons.directive';
import { GeneItemDirective } from './gene-item.directive';
import { GeneNameComponent } from './gene-name.component';
import { LoadingPlaceholderComponent } from './loading-placeholder/loading-placeholder.component';
import { NavComponent } from './nav/nav.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PhenotypeItemDirective } from './phenotype-item.directive';
import { PhenotypeNamePipe } from './phenotype-name.pipe';
import { QueryLoadingBarComponent } from './query-loading-bar/query-loading-bar.component';
import { SearchBarComponent } from './search/search-bar/search-bar.component';
import { SearchSuggestionsComponent } from './search/search-suggestions/search-suggestions.component';
import { ShelfItemSettingsComponent } from './shelf-item-settings/shelf-item-settings.component';
import { ShelfItemSettingsOverlayComponent } from './shelf-item-settings/shelf-item-settings.overlay.component';
import { EditCustomGeneGroupOverlayComponent } from './shelf/edit-custom-gene-group/edit-custom-gene-group.component';
import { ShelfOverlayComponent } from './shelf/shelf-overlay.component';
import { ShelfComponent } from './shelf/shelf.component';

@NgModule({
	entryComponents: [
		ShelfOverlayComponent,
		ColourPickerOverlayComponent,
		ShelfItemSettingsOverlayComponent,
		EditCustomGeneGroupOverlayComponent,
		SearchSuggestionsComponent,
		PathwaysComponent,
		SettingsComponent,
	],
	imports: [
	CommonModule,
		LayoutModule,
		MaterialModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		DragDropModule,
		HttpClientModule,
		SettingsModule,
	],
	exports: [
		NavComponent,
		QueryLoadingBarComponent,
		ShelfComponent,
		ShelfOverlayComponent,
		ShelfItemSettingsOverlayComponent,
		GeneNameComponent,
		PhenotypeNamePipe,
		ExpandableTableComponent,
		GeneItemDirective,
		PhenotypeItemDirective,
		SearchBarComponent,
		AutoFocusDirective,
		CsvImportComponent,
	],
	declarations: [
		NavComponent,
		QueryLoadingBarComponent,
		PhenotypeNamePipe,
		ShelfComponent,
		ShelfOverlayComponent,
		PageNotFoundComponent,
		GeneNameComponent,
		ColourPickerOverlayComponent,
		ShelfItemSettingsComponent,
		ShelfItemSettingsOverlayComponent,
		ExpandableTableComponent,
		GeneItemDirective,
		PhenotypeItemDirective,
		EditCustomGeneGroupOverlayComponent,
		TitleButtonsDirective,
		LoadingPlaceholderComponent,
		SearchBarComponent,
		SearchSuggestionsComponent,
		AutoFocusDirective,
		CsvImportComponent,
	],
})
export class CoreModule {}
