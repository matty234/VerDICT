import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Phenotype } from '../phenotype/phenotype.model';
import { Gene } from './gene.model';

export interface IGeneService {

	/**
	 * Gets the diseases related to a specific gene.
	 *
	 * @param id the disease id
	 */
	getDiseases(id: number): Observable<Phenotype[]>;

	/**
	 * Gets the attributes belonging to a gene of a giving ID.
	 *
	 * @param id the id of the gene to search for
	 */
	getGene(id: number): Observable<Gene>;

	/**
	 * Gets the genes belonging related to a specific phenotype (as ascertained through the OMIM
	 * morbidmap)
	 *
	 * @param omim the phenotype omim
	 */
	getGenesForPhenotype(omim: number): Observable<Gene[]>;

	/**
	 * Gets the genes belonging related to a specific phenotype (as ascertained through the OMIM
	 * morbidmap)
	 *
	 * @param omim the phenotype omim
	 */
	getPhenotypesForGene(id: number): Observable<Phenotype[]>;

	/**
	 * Gets genes that this gene interacts with (i.e. this -> another gene)
	 * @param id the entrez identifier of the gene
	 */
	getInteractsWith(id: number): Observable<Gene[]>;
}

@Injectable({
	providedIn: 'root',
})
export class GeneService {
	constructor(private http: HttpClient) {}

	getGene(entrez: number): Observable<Gene> {
		return this.http.get<Gene>(`${environment.api.root}/${environment.api.gene}/${entrez}`);
	}

	getPhenotypesForGene(entrez: number): Observable<Phenotype[]> {
		return this.http.get<Phenotype[]>(`${environment.api.root}/${environment.api.gene}/${entrez}/phenotypes`);
	}

	getInteractsWith(entrez: number): Observable<Gene[]> {
		return this.http.get<Gene[]>(`${environment.api.root}/${environment.api.gene}/${entrez}/interacts`);
	}
}
