import { Route } from '@angular/router';

export enum ViewType {
	PHENOTYPE = 'phenotype',
	GENE = 'gene',
	PATHWAY = 'pathway',
}

export class Data {
	viewType?: ViewType = null;
}
export interface CustomRoute extends Route {
	data?: Data;
}

export type VerdictRoutes = CustomRoute[];
