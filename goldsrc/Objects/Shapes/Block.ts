import Data2 from '../Data';
import Object2 from '../Object';

import Blocks from './Blocks';

import { default as THREE, Clock, Scene, MeshPhongMaterial, Color, Mesh } from 'three';

import Util from '../../Random';


export let FACEWORDS = ['right', 'left', 'front', 'back', 'top', 'bottom'];
export let FACEWORDSINV = ['left', 'right', 'back', 'front', 'bottom', 'top'];

const defaultSty = 'sty/commercial/storefront/577.bmp';

export class Block extends Object2 {

	mesh: THREE.Mesh
	geometry: THREE.BoxBufferGeometry
	materials: THREE.Material[]

	constructor(data: Data2) {
		super(data);

		// the Defaults
		if (!this.data.faces) this.data.faces = [];

		this.make();

		Blocks.show(this);
	}

	// Override
	destroy() {
		super.destroy();

		this.geometry.dispose();

		let i = 0;
		for (; i < 6; i++) {
			this.materials[i].dispose();
		}
	}

	make() {
		this.materials = [];

		const boxCutting = true;

		if (!boxCutting) {
			this.geometry = Blocks.geometry.clone();
		}
		else {
			this.geometry = Blocks.getBox(this.data);
		}

		let i = 0;
		let faceCount = -1;
		for (; i < 6; i++) {

			let sty = this.data.faces![i] || this.data.sty;

			if (!sty)
				continue;

			faceCount++;

			let mat = new MeshPhongMaterial({
				map: Util.loadTexture(sty),
				color: new Color(this.data.color)
			});

			this.materials[i] = mat;

			// Now, see if this is upside
			if (this.geometry.groups[faceCount].materialIndex != 4)
				continue;

			if (this.data.f)
				Util.UV.flipPlane(this.geometry, faceCount, true);

			if (this.data.r)
				Util.UV.rotatePlane(this.geometry, faceCount, this.data.r);

		}

		this.mesh = new Mesh(
			this.geometry,
			this.materials);
		this.mesh.matrixAutoUpdate = false;
		this.mesh.frustumCulled = false;
		this.mesh.castShadow = true;
		this.mesh.receiveShadow = true;

		this.mesh.position.set(
			this.data.x * 64 + 32,
			this.data.y * 64 + 32,
			this.data.z * 64 + 32);

		this.mesh.updateMatrix();
	}

}

export default Block;