import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, from, merge, Observable, zip } from 'rxjs';
import { catchError, concat, concatAll, flatMap, map, mergeMap } from 'rxjs/operators';
import { Gene } from 'src/app/directory/gene/gene.model';
import { GeneService } from 'src/app/directory/gene/gene.service';
import { KegResponse } from './pathways.model';

@Injectable({
	providedIn: 'root',
})
export class PathwaysService {
	constructor(private http: HttpClient) {}

	getPathways(entrez: number): Observable<KegResponse[]> {
		return this.http
			.get<any[]>(
				`https://cors-anywhere.herokuapp.com/http://togows.org/entry/kegg-genes/hsa:${entrez}/pathways.json`,
			)
			.pipe(
				map((raw) => {
					const kegResponses: KegResponse[] = new Array<KegResponse>();
					for (const key in raw[0]) {
						if (raw[0].hasOwnProperty(key)) {
							const element = raw[0][key];
							kegResponses.push({
								id: key,
								name: element,
							});
						}
					}
					return kegResponses;
				}),
			);
	}

	searchPathways(query: string): Observable<KegResponse[]> {
		return this.http
			.get<string[]>(
				`https://cors-anywhere.herokuapp.com/http://togows.org/search/kegg-pathway/${query}/1,200.json`,
			)
			.pipe(
				catchError(() => from([])),
				map((raw) => {
					const kegResponses: KegResponse[] = new Array<KegResponse>();
					for (const result of raw) {
						const splitRawLine = result.split('\t');
						kegResponses.push({
							id: `hsa${(splitRawLine[0] as string).split('map')[1]}`,
							name: splitRawLine[1],
						});
					}
					return kegResponses;
				}),
			);
	}

	getPathway(kegId: string): Observable<Gene[]> {
		return this.http.get<any[]>(`https://cors-anywhere.herokuapp.com/http://togows.org/entry/kegg-pathway/${kegId}/genes.json`).pipe(
			map((raw) => {
				const geneIds: Gene[] = new Array<Gene>();
				for (const key in raw[0]) {
					if (raw[0].hasOwnProperty(key)) {
						geneIds.push(new Gene({ entrez: Number(key), official_symbol: raw[0][key].split(';')[0] }));
					}
				}
				return geneIds;
			}),
		);
	}
}
