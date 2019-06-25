import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { darken } from 'color-blend';
import { Observable } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { StoredShelfValue } from '../../core/shelf/shelf.model';
import { LoadingOverlayService } from '../../network/loading-overlay/loading-overlay.service';
import { Link } from '../../network/network.model';
import { Gene } from '../gene/gene.model';
import { CardiganPPIRelation, Phenotype, Segment } from './phenotype.model';

@Injectable({
	providedIn: 'root',
})
export class PhenotypeService {
	constructor(
		private http: HttpClient,
		private snackbar: MatSnackBar,
		private loadingOverlayService: LoadingOverlayService,
	) {}

	getPhenotype(omim: number): Observable<Phenotype> {
		return this.http
			.get<Phenotype>(`${environment.api.root}/${environment.api.phenotype}/${omim}`)
			.pipe(map((p) => new Phenotype(p)));
	}

	getCardiganPredictedGenes(omim: number, limit = 200): Observable<Gene[]> {
		return this.http.get<Gene[]>(`${environment.api.root}/${environment.api.phenotype}/${omim}/cardigan`, {
			params: {
				limit: String(limit),
			},
		});
	}

	getRelatedPhenotypes(omim: number, limit = 10, minimumScore?: number): Observable<Phenotype[]> {
		return this.http.get<Phenotype[]>(`${environment.api.root}/${environment.api.phenotype}/${omim}/related`);
	}

	getGenes(omim: number, limit = 200): Observable<Gene[]> {
		return this.http.get<Gene[]>(`${environment.api.root}/${environment.api.phenotype}/${omim}/genes`, {
			params: {
				limit: String(limit),
			},
		});
	}

	/*getCardiganIntersect(shelfValues: StoredShelfValue[]): Observable<Gene[]> {
		const queries: string[] = [];
		for (const shelfValue of shelfValues.slice(1)) {
			if (DiseaseShelfValue.isDiseaseShelfValue(shelfValue)) {
				queries.push(
					`
						match (n1:PHENOTYPE {omim: ${shelfValue.omim} })-[r:PREDICTED_INTERACTION]->(b:GENE)
						with r,b,p ORDER BY r.score DESC LIMIT ${shelfValue.limit} with apoc.coll.intersection(p, collect(b)) as p
					`
				);
			}
		}

		return this.ngNeo4jService
			.query(
				`match (n1:PHENOTYPE {omim: ${(<DiseaseShelfValue[]>shelfValues)[0]
					.omim} })-[r:PREDICTED_INTERACTION]->(a:GENE)
					with r, a ORDER BY r.score DESC LIMIT ${(<DiseaseShelfValue[]>shelfValues)[0].limit} with collect(a) as p
					${queries.join(' ')}
					RETURN p
				`
			)
			.pipe(
				map((result) => {
					if (result.records.length > 0) {
						return result.records[0].get('p').map((record) => {
							return new Gene(record.properties);
						});
					} else {
						return [];
					}
				})
			);
	}*/

	getCardiganPredictionsOnPPI(shelfValues: StoredShelfValue[], ppiDegrees: number): Observable<CardiganPPIRelation> {
		function mixHexColors(hexA, hexB) {
			const base = hexA.substring(1).match(/.{1,2}/g).map((r) => parseInt(r, 16));
			const added = hexB.substring(1).match(/.{1,2}/g).map((r) => parseInt(r, 16));

			const v = darken(
				{ r: base[0], g: base[1], b: base[2], a: 0.6 },
				{ r: added[0], g: added[1], b: added[2], a: 0.6 },
			);
			return (
				'#' +
				Math.round(v.r).toString(16).padStart(2, '0') +
				Math.round(v.g).toString(16).padStart(2, '0') +
				Math.round(v.b).toString(16).padStart(2, '0')
			);
		}
		return this.http.post(`${environment.api.root}/${environment.api.graph}/depth/${ppiDegrees}`, shelfValues).pipe(
			catchError(({ error }) => {
				this.snackbar.open(error.reason.message || 'Unknown error', null, {
					duration: 3000,
				});
				// Theres a more graceful way of doing this somewhere
				this.loadingOverlayService.close();
				return null;
			}),
			filter((e) => !!e),
			map((records: any) => {
				const nodes: Gene[] = [];
				const links = [];

				records.forEach((record: any) => {
					let shelfValue: StoredShelfValue;
					let colour: string;
					shelfValue = shelfValues.find((value) => value.uid === record._fields[record._fieldLookup['uid']]);
					colour = shelfValue.colour;
					record._fields[record._fieldLookup['roots']].forEach(({ properties }) => {
						const existing = nodes.find((node) => node.id === properties.entrez);
						if (existing) {
							existing.bumpSize();
							existing.color =
								existing.color === 'black'
									? existing.color
									: mixHexColors(existing.color + '80', colour + '80');
							existing.isMultiplePrimary = true; // This might not be right
							existing.pushShelfMembership(shelfValue.uid);
						} else {
							const gene = new Gene(properties);
							gene.color = colour;

							gene.pushShelfMembership(shelfValue.uid);
							nodes.push(gene);
						}
					});

					/*
						For squares
					*/
					record._fields[record._fieldLookup['nodes']].forEach(({ properties }) => {
						const existing = nodes.find((node) => node.id === properties.entrez);
						if (existing) {
							existing.bumpSize();
							existing.pushSecondaryShelfMembership(shelfValue.uid);
						} else {
							const gene = new Gene(properties);
							gene.color = 'black';
							gene.isSecondary = true;
							gene.pushSecondaryShelfMembership(shelfValue.uid);
							nodes.push(gene);
						}
					});

					links.push(
						...record._fields[record._fieldLookup['steps']].map(
							(properties) => new Link({ source: properties.start, target: properties.end }),
						),
					);
				});

				return {
					nodes,
					links,
				} as CardiganPPIRelation;
			}),
		);
	}

	getShortestPath(existingNodes: Gene[], shelfValues: StoredShelfValue[]): Observable<CardiganPPIRelation> {
		return this.http.post(`${environment.api.root}/${environment.api.graph}/shortestpaths`, shelfValues).pipe(
			catchError(({ error }) => {
				this.snackbar.open(error.reason.message || 'Unknown error', null, {
					duration: 3000,
				});
				// Theres a more graceful way of doing this somewhere
				this.loadingOverlayService.close();
				return null;
			}),
			map((records: any) => {
				const nodes = existingNodes;
				const links = Array<Link>();
				records.forEach((record) => {
					const result: {
						start: any;
						end: any;
						segments: Segment[];
					} =
						record._fields[record._fieldLookup['sp']];

					const existingStart = nodes.findIndex((node) => node.id === result.start.properties.entrez);
					if (existingStart === -1) {
						nodes.push(new Gene({ ...result.start.properties, color: '#424242', isSecondary: true }));
					}

					const existingEnd = nodes.findIndex((node) => node.id === result.end.properties.entrez);
					if (existingEnd === -1) {
						nodes.push(new Gene({ ...result.end.properties, color: '#424242', isSecondary: true }));
					}

					nodes.push(
						...result.segments
							.filter((node2) => !nodes.find((node) => node.id === node2.end.properties.entrez))
							.map(
								(segment) =>
									new Gene({ ...segment.end.properties, color: '#424242', isSecondary: true }),
							),
					);
					links.push(
						...result.segments.map((segment) => {
							return new Link({
								source: segment.start.properties.entrez,
								target: segment.end.properties.entrez,
								isShortestPath: true,
							});
						}),
					);
				});
				return new CardiganPPIRelation({
					nodes,
					links,
				});
			}),
		);
	}
}
