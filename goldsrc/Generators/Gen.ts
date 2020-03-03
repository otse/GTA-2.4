import Data2 from "../Objects/Data";

export namespace Gen {

	export type Truple = [number, number, number];

	export enum Axis {
		Horz = 0,
		Vert = 1
	}

	export function invert(
		data: Data2,
		axis: Axis,
		w: [number, number, number]) {
		let x = data.x;
		let y = data.y;
		data.x = axis ? y : x;
		data.y = axis ? x : y;
		data.r = axis;
		data.x += w[0];
		data.y += w[1];
	}

	export function loop(
		min: [number, number, number],
		max: [number, number, number],
		func: (w: [number, number, number]) => any) {

		let x = 0;
		for (; x < max[0]; x++) {
			let y = 0;
			for (; y < max[1]; y++) {
				let z = 0;
				for (; z < max[2]; z++) {

					func([min[0] + x, min[1] + y, min[2] + z]);

				}
			}
		}
	}

}

export default Gen;