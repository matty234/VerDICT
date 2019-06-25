import { Node } from '../../network/network.model';
import { Phenotype } from '../phenotype/phenotype.model';

export class Gene extends Node {
	entrez: number;
	official_symbol: string;

	interactsWith: Gene[] = [];
	receivesInteraction: Gene[] = [];
	shelfMembership: string[] = [];
	secondaryShelfMembership: string[] = [];
	score = 0;

	constructor({
		entrez,
		official_symbol,
		color,
		shelfMembership = [],
		secondaryShelfMembership = [],
		score,
		isSecondary = false,
		isMultiplePrimary = false,
	}: Partial<Gene>) {
		super(entrez || 0, color);
		this.size = 20;
		this.entrez = entrez;
		this.official_symbol = official_symbol;
		this.shelfMembership = shelfMembership;
		this.score = score;
		this.secondaryShelfMembership = secondaryShelfMembership;
		this.isSecondary = isSecondary;
		this.isMultiplePrimary = isMultiplePrimary;
	}

	get formattedTootlip(): string {
		return `
		<div class="tooltip">
			<p class="officialsymbol">${this.official_symbol} <span class="id">${this.entrez}</span></p>
		</div>
	`;
	}

	pushShelfMembership(shelfUid: string) {
		this.shelfMembership.push(shelfUid);
	}
	pushSecondaryShelfMembership(shelfUid: string) {
		this.secondaryShelfMembership.push(shelfUid);
	}
}
