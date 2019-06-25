import { GeneService, IGeneService } from './gene.service';
import { Gene } from './gene.model';
import { Observable } from 'rxjs';
import { Phenotype } from '../phenotype/phenotype.model';

export class MockGeneService implements IGeneService {
	getDiseases(id: number): Observable<Phenotype[]> {
		throw new Error('Method not implemented.');
	}
	getGene(id: number): Observable<Gene> {
		throw new Error('Method not implemented.');
	}
	getGenesForPhenotype(omim: number): Observable<Gene[]> {
		throw new Error('Method not implemented.');
	}
	getPhenotypesForGene(id: number): Observable<Phenotype[]> {
		throw new Error('Method not implemented.');
	}
	getInteractsWith(id: number): Observable<Gene[]> {
		throw new Error('Method not implemented.');
	}
}
