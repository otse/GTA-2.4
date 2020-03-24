import Rectangle from "../Objects/Rectangle";
import Data2 from "../Objects/Data";

import APhysic from "./Every line is a physic";
import Cars from "./Cars";

import KILL from "../KILL";

import { Mesh, MeshBasicMaterial } from "three";
import Util from "../Random";
import Sheet from "../Sprites/Sheet";
import Phong2 from "../Shaders/Phong2";

interface DeltaMesh {
	sprite: Square
	mesh: Mesh
}

export class Car extends Rectangle {

	physics: APhysic.Interface

	sheet: Sheet

	deltas: DeltaMesh[]

	deltaSty: string
	sty: string

	constructor(data: Data2) {
		super(data);

		this.deltas = [];

		Cars.add(this);

		if (undefined == data.car) data.car = 'Minx';

		this.lift = 1;

		this.make(this.data);

		this.sheet = Cars.deltasSheets[data.car];

		this.addDelta(Cars.deltaSquares.dent_front_left);
	}

	destroy() {
		super.destroy();

		Cars.remove(this);
	}

	make(data: Data2) {
		this.physics = APhysic.get(data.car);

		const model = this.physics.model;

		let unpaint = this.physics.x_colorless || undefined == data.spray;

		if (unpaint) {
			this.sty = `sty/car/unpainted/GTA2_CAR_${model}X.bmp`;
			this.deltaSty = `sty/car/pinky_deltas/D_GTA2_CAR_${model}.bmp`;
		}
		else {
			let pal = `_PAL_${data.spray}`;

			this.sty = `sty/car/painted/GTA2_CAR_${model}${pal}.bmp`;
			this.deltaSty = `sty/car/painted_deltas/D_GTA2_CAR_${model}${pal}.bmp`;
		}

		data.width = this.physics.x_img_width;
		data.height = this.physics.x_img_height;

		this.makeRectangle({
			map: this.sty,
			blur: `sty/car/blurs/GTA2_CAR_${model}.png`,
			shadow: data.sty
		});
	}

	// deltas

	addDelta(square: Square): void /*Car['delta']*/ {
		const OFFSET = 0.1;
		let mesh, material;
		material = Phong2.carDeltaShader({
			transparent: true,
			map: Util.loadTexture(this.deltaSty)
		}, {});
		mesh = new Mesh(this.geometry.clone(), material);
		mesh.position.set(0, 0, OFFSET);
		this.mesh.add(mesh);
		Util.UV.fromSheet(mesh.geometry, square, this.sheet);
		let length = this.deltas.push({
			sprite: square,
			mesh: mesh
		});
		//return this.deltas[length - 1];
	}

	removeDelta(square: Square): void {
		for (let delta of this.deltas) {
			if (delta.sprite != square)
				continue;
			this.mesh.remove(delta.mesh);
			this.deltas.splice(this.deltas.indexOf(delta), 1);
			return;
		}
	}

	hasDelta(square: Square): boolean {
		for (let delta of this.deltas) {
			if (delta.sprite == square)
				return true;
		}
		return false;
	}


}

export default Car;