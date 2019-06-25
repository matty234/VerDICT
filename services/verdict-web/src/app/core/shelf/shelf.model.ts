import { color } from 'color-blend';
import { Gene } from 'src/app/directory/gene/gene.model';

export class StoredShelfValue {
	name: string;
	colour: string;
	minScore: number;
	limit: number;
	geneSet: 'HAS_GENE' | 'PREDICTED_INTERACTION';
	uid: string;

	constructor({
		name,
		colour = '#FF0000',
		minScore = 0,
		limit = 5,
		geneSet = 'HAS_GENE',
	}: Partial<StoredShelfValue>) {
		this.name = name || 'Untitled Group';
		this.colour = colour;
		this.limit = limit;
		this.geneSet = geneSet;
		this.minScore = minScore;
		this.uid = 'uuid-' + (new Date().getTime().toString(16) + Math.floor(1e7 * Math.random()).toString(16));
	}
}
export class DiseaseShelfValue extends StoredShelfValue {
	omim: number;

	constructor(shelfValue: Partial<DiseaseShelfValue>) {
		super(shelfValue);
		this.omim = shelfValue.omim;
	}

	static isDiseaseShelfValue(arg: any): arg is DiseaseShelfValue {
		return arg !== undefined && arg.omim !== undefined;
	}
}

export class CustomGeneGroupShelfValue extends StoredShelfValue {
	genes = new Array<Gene>();
	constructor(shelfValue: Partial<CustomGeneGroupShelfValue>) {
		super(shelfValue);
		this.genes = shelfValue.genes || new Array<Gene>();
	}

	static isCustomGeneGroupShelfValue(arg: any): arg is CustomGeneGroupShelfValue {
		return arg !== undefined && arg.genes !== undefined;
	}

	addGene(gene: Gene) {
		this.genes.push(gene);
	}
}
