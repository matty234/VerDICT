import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

import { environment } from '../environments/environment';
import { AboutComponent } from './about/about.component';
import { AboutModule } from './about/about.module';
import { AppComponent } from './app.component';
import { VerdictRoutes, ViewType } from './app.model';
import { CardiganComponent } from './cardigan/cardigan.component';
import { CardiganModule } from './cardigan/cardigan.module';
import { CoreModule } from './core/core.module';
import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component';
import { DirectoryComponent } from './directory/directory.component';
import { DirectoryModule } from './directory/directory.module';
import { HomeComponent } from './home/home.component';
import { HomeModule } from './home/home.module';
import { MaterialModule } from './material.module';
import { NetworkComponent } from './network/network.component';
import { NetworkModule } from './network/network.module';
import { TargetExplorerModule } from './target-explorer/target-explorer.module';

const appRoutes: VerdictRoutes = [
	{
		path: '',
		component: HomeComponent,
	},
	{
		path: 'phenotype/:id',
		component: DirectoryComponent,
		data: {
			viewType: ViewType.PHENOTYPE,
		},
	},
	{
		path: 'gene/:id',
		component: DirectoryComponent,
		data: {
			viewType: ViewType.GENE,
		},
	},
	{
		path: 'pathway/:id',
		component: DirectoryComponent,
		data: {
			viewType: ViewType.PATHWAY,
		},
	},
	{
		path: 'network',
		component: NetworkComponent,
	},
	{
		path: 'about',
		component: AboutComponent,
	},
	/*{
		path: 'cardigan',
		component: CardiganComponent
	},*/
	{ path: '**', component: PageNotFoundComponent },
];

@NgModule({
	declarations: [ AppComponent ],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		RouterModule.forRoot(appRoutes),
		CoreModule,
		HomeModule,
		MaterialModule,
		DirectoryModule,
		AboutModule,
		ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
		HttpClientModule,
		NetworkModule,
		// CardiganModule,
		TargetExplorerModule,
		ScrollToModule.forRoot(),
	],
	exports: [ MaterialModule, TargetExplorerModule ],
	providers: [],
	bootstrap: [ AppComponent ],
})
export class AppModule {}
