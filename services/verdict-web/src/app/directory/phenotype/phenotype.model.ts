import { DiseaseShelfValue, StoredShelfValue } from '../../core/shelf/shelf.model';
import { Link, Node } from '../../network/network.model';
import { Gene } from '../gene/gene.model';

export class Phenotype extends Node {
	omim: number;
	name: string[];
	relatedTo: Phenotype[];
	hasGenes: Gene[];
	score: number;

	public get shelfValue(): StoredShelfValue {
		return new DiseaseShelfValue({
			name: this.name[0],
			omim: this.omim,
			colour: '#FF0000',
			minScore: 0,
			limit: 10,
			geneSet: 'HAS_GENE',
		});
	}
	constructor({ omim, name, score }: Partial<Phenotype>) {
		super(omim);
		this.omim = omim;
		this.name = name;
		this.score = score;
	}
}

export class ColoredPhenotype extends Phenotype {
	color: string;
}

export class PhenotypeNeighbourhood {
	color: string;
	genes: Gene[];
	phenotype: Phenotype;

	constructor({ genes, phenotype }: Partial<PhenotypeNeighbourhood>) {
		this.genes = genes;
		this.phenotype = phenotype;
	}
}

export class CardiganPPIRelation {
	nodes = new Array<Gene>();
	links = new Array<Link>();

	constructor({ nodes, links }: Partial<CardiganPPIRelation>) {
		if (nodes) {
			this.nodes = nodes || [];
		}
		if (links) {
			this.links = links || [];
		}
	}

	merge(relation: CardiganPPIRelation): CardiganPPIRelation {
		return new CardiganPPIRelation({
			nodes: [...this.nodes, ...relation.nodes],
			links: [...this.links, ...relation.links],
		});
	}
}

export class TypedCardiganValues {
	type: 'nodes' | 'relations';
	relations?: CardiganRelation[];
	nodes?: Gene[];
	forOmim: number;

	constructor({ type, relations, nodes, forOmim }: Partial<TypedCardiganValues>) {
		this.type = type;
		this.relations = relations;
		this.nodes = nodes;
		this.forOmim = forOmim;
	}
}

export class CardiganRelation extends Link {
	start: number;
	end: number;

	constructor({ start, end }: { start: any; end: any }) {
		super({ source: start, target: end });
		this.start = start;
		this.end = end;
	}
}

export class ShortestPathResult {
	start: Gene;
	end: Gene;
	segments: Gene[];
}

export class Segment {
	start: any;
	end: any;
	relationship: any;
}
