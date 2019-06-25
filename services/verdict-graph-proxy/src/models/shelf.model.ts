export abstract class IStoredShelfValue {
	public name: string;
	public colour: string;
	public minScore: number;
	public limit: number;
	public geneSet: 'HAS_GENE' | 'PREDICTED_INTERACTION';
	public uid: string;
}

export interface IHandlers {
	diseaseShelfValueHander: (disease: DiseaseShelfValue) => string;
	customGeneGroupShelfValueHander: (customGeneGroup: CustomGeneGroupShelfValue) => string;
}

export class DiseaseShelfValue extends IStoredShelfValue {

	public static isDiseaseShelfValue(arg: any): arg is DiseaseShelfValue {
		return arg !== undefined && arg.omim !== undefined;
	}

	public omim: number;
}

export class CustomGeneGroupShelfValue extends IStoredShelfValue {

	public static isCustomGeneGroupShelfValue(arg: any): arg is CustomGeneGroupShelfValue {
		return arg !== undefined && arg.genes !== undefined;
	}

	public genes = new Array<any>();
}
