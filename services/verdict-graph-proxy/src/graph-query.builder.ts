import { CustomGeneGroupShelfValue, DiseaseShelfValue, IHandlers, IStoredShelfValue } from './models/shelf.model';

export class GraphQueryBuilder {
	public shelfItems: IStoredShelfValue[];
	constructor(private prepend: string, private append: string, private shelfHandlers: IHandlers) {}

	public addShelfItem(shelfValues: IStoredShelfValue[]): GraphQueryBuilder {
		this.shelfItems = shelfValues;
		return this;
	}

	public build(): string {
		const shelfItemsValue = this.shelfItems.map<string>(this.getShelfItemString.bind(this)).join('');
		return this.prepend + shelfItemsValue + this.append;
	}

	private getShelfItemString(shelfItem: IStoredShelfValue): string {
		if (DiseaseShelfValue.isDiseaseShelfValue(shelfItem)) {
			return this.shelfHandlers.diseaseShelfValueHander(shelfItem);
		}
		if (CustomGeneGroupShelfValue.isCustomGeneGroupShelfValue(shelfItem)) {
			return this.shelfHandlers.customGeneGroupShelfValueHander(shelfItem);
		}
	}
}
