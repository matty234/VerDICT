import { Material, MeshLambertMaterial } from 'three';

export class Position {
	x = 0;
	y = 0;
	z = 0;
}

export class Node {
	id: number;
	isSecondary = false;
	isMultiplePrimary = false;
	color = 'black';
	size = 10;

	tooltip = String(this.id);

	set z(z: number) {
		this.position.z = z;
	}

	get z(): number {
		return this.position.z;
	}

	get formattedTootlip() {
		return `<div class="tooltip">${this.tooltip}</div>`;
	}

	position: Position = new Position();

	constructor(id: number, color?: string) {
		this.id = id;
		this.color = color;
	}

	bumpSize() {
		this.size += 1;
	}
}

export class Link {
	source: number;
	target: number;
	isShortestPath: boolean;

	constructor({ source, target, isShortestPath = false }: Partial<Link>) {
		this.source = source;
		this.isShortestPath = isShortestPath;
		this.target = target;
	}
}

export class GraphValues {
	nodes: Node[] = [];
	links: Link[] = [];

	static create(parent: Node, nodes: Node[]): Promise<GraphValues> {
		return new Promise<GraphValues>((resolve, reject) => {
			const values = new GraphValues();

			const newLinks = nodes.map((node) => {
				return new Link({ source: parent.id, target: node.id });
			});
			values.links.push(...newLinks);
			values.nodes.push(parent, ...nodes);
			resolve(values);
		});
	}

	pushNodes(newNodes: Node[]) {
		if (!this.nodes) {
			this.nodes = [];
		}
		this.nodes.push(...newNodes);
	}

	merge(parent: Node, nodes: Node[]): Promise<GraphValues> {
		return new Promise<GraphValues>((resolve, reject) => {
			const newLinks = nodes.map((node) => {
				return new Link({ source: parent.id, target: node.id });
			});
			this.links.push(...newLinks);
			this.nodes.push(parent, ...nodes);
			resolve(this);
		});
	}
}

export abstract class IMaterials {
	primary: (color?: string) => MeshLambertMaterial;
	secondary: (color?: string) => MeshLambertMaterial;
	multiple: (color?: string) => MeshLambertMaterial;
}
