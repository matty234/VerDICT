import { MeshLambertMaterial, TextureLoader } from 'three';

import { IMaterials } from './network.model';

export class Materials implements IMaterials {
	private multipleTexture = new TextureLoader().load('/assets/textures/multiple.jpg');
	multiple = () =>
		new MeshLambertMaterial({
			map: this.multipleTexture,
			depthWrite: true,
			transparent: true,
			opacity: 0.9,
		})

	secondary = (color = 'white') =>
		new MeshLambertMaterial({
			depthWrite: true,
			transparent: true,
			color,
			opacity: 0.8,
		})

	primary = (color = 'white') =>
		new MeshLambertMaterial({
			depthWrite: true,
			transparent: true,
			color,
			opacity: 0.8,
		})
}
