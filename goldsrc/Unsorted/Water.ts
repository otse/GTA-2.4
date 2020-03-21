import { Texture, MeshPhongMaterial } from "three";
import Four from "../Four";
import Util from "../Random";

namespace Water {

	let time
	let j
	let waters: Texture[]

	export var material: MeshPhongMaterial

	export function init() {
		time = 0;
		j = 0;
		waters = [];

		for (let i = 1; i <= 12; i++)
			waters.push(Util.loadTexture(`sty/special/water/${i}.bmp`));

		material = new MeshPhongMaterial({
			map: waters[0]
		});
	}

	export function update() {
		time += Four.delta;

		if (time >= 0.11) {
			j += j < 11 ? 1 : -11;
			material.map = waters[j];
			time = 0;
		}
	}

}

export default Water;