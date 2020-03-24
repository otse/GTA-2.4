import Rectangle from "../Objects/Rectangle";
import Data2 from "../Objects/Data";

import APhysic from "./Every line is a physic";
import Cars from "./Cars";

import KILL from "../KILL";

import { Mesh } from "three";
import Util from "../Random";
import Sheet from "../Sprites/Sheet";

interface Delta {
	square: Square
	mesh: Mesh
}

export class Car extends Rectangle {

	physics: APhysic.Interface

	sheet: Sheet

	deltas: Delta[]

	constructor(data: Data2) {
		super(data);

		this.deltas = [];

		Cars.add(this);

		if (undefined == data.car) data.car = 'Minx';

		this.lift = 1;

		this.make();
	}

	destroy() {
		super.destroy();

		Cars.remove(this);
	}

	make() {
		this.physics = APhysic.get(this.data.car);

		const model = this.physics.model;

		if (this.physics.x_colorless || undefined == this.data.spray)
			this.data.sty = `sty/car/unpainted/GTA2_CAR_${model}X.bmp`;

		else
			this.data.sty = `sty/car/painted/GTA2_CAR_${model}_PAL_${this.data.spray}.bmp`;

		this.data.width = this.physics.x_img_width;
		this.data.height = this.physics.x_img_height;

		this.makeRectangle({
			blur: `sty/car/blurs/GTA2_CAR_${model}.png`,
			shadow: this.data.sty
		});
	}

	// deltas
	// simple overlaying meshes

	addDelta(square: Square) {
		let mesh;
		mesh = new Mesh(this.geometry.clone(), this.material);
		mesh.position.set(0, 0, 0.01);
		this.mesh.add(mesh);
		Util.UV.fromSheet(mesh.geometry, square, this.sheet);
		return this.deltas[this.deltas.push({
			square: square,
			mesh: mesh
		}) - 1];
	}

	removeDelta(square: Square) {
		for (let delta of this.deltas) {
			if (delta.square != square)
				continue;
			this.mesh.remove(delta.mesh);
			this.deltas.splice(this.deltas.indexOf(delta), 1);
			return;
		}
	}

	hasDelta(square: Square) {
		for (let delta of this.deltas) {
			if (delta.square == square)
				return true;
		}
		return false;
	}


}

export default Car;