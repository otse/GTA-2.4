import { Data2, Object2, Surfaces, Spritesheet, Spritesheets } from "@app/exports";

import { Mesh, Material, PlaneBufferGeometry, MeshPhongMaterial, Color, DoubleSide } from "three";

import Util from "@app/util";

const defaultSty = 'sty/commercial/storefront/577.bmp';

export class Surface extends Object2 {

	mesh: Mesh
	material: Material
	geometry: PlaneBufferGeometry

	constructor(data: Data2) {
		super(data);

		// the Defaults
		//if (!this.data.color) this.data.color = 'white';
		//if (!this.data2.faces) this.data2.faces = [];

		this.Make();
	}

	// Override
	Destroy() {
		super.destroy();

		Surfaces.Hide(this);

		this.geometry.dispose();

		this.material.dispose();

		delete this.mesh;
		delete this.geometry;
		delete this.material;
	}

	Make() {
		this.geometry = Surfaces.geometry.clone();

		const hasSheet = this.data.sheet && this.data.square;

		// Cutting can prevent texture bleeding
		// but is quite heavy
		const CUT = false;

		let map;

		if (hasSheet) {
			let spritesheet = Spritesheets.Get(this.data.sheet);
			let square = spritesheet!.squares[this.data.square!];

			/*
			// compat
			if (CUT) {
				const key = `sh ${this.data.sheet} sq ${this.data.square}`;

				map = Sprites.Cut(square, sheet, key);
			}*/
			//else {
				map = Util.loadTexture(spritesheet!.file);

				Util.UV.fromSheet(this.geometry, square, spritesheet!);
			//}
		}
		else {
			map = Util.loadTexture(this.data.sty);
		}

		this.material = new MeshPhongMaterial({
			map: map,
			shininess: 0,
			color: new Color(this.data.color),
			side: DoubleSide
		});

		this.mesh = new Mesh(this.geometry, this.material);
		this.mesh.matrixAutoUpdate = false;
		this.mesh.frustumCulled = false;
		this.mesh.castShadow = false;
		this.mesh.receiveShadow = true;

		this.mesh.position.set(
			this.data.x * 64 + 32,
			this.data.y * 64 + 32,
			this.data.z! * 64);

		this.mesh.updateMatrix();

		if (this.data.f) Util.UV.FlipPlane(this.geometry, 0, true);
		if (this.data.r) Util.UV.RotatePlane(this.geometry, 0, this.data.r);

		Surfaces.Show(this);
	}

	slope() {
		if (!this.data.slope)
			return;

		for (let i in this.data.slope) {
			let p = this.geometry.getAttribute('position').array;

			//this.geometry.attributes.position.needsUpdate = true;

			const slope = this.data.slope[i];
			const pts = 8 * slope;

			/*switch (i) {
				case 0:
					p[2] = pts;
					p[5] = pts;
					break;
				case 1:
					p[5] = pts;
					p[11] = pts;
					break;
				case 2:
					p[8] = pts;
					p[11] = pts;
					break;
				case 3:
					p[2] = pts;
					p[8] = pts;
			}*/
		}
	}
}

export default Surface;