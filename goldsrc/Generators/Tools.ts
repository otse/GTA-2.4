import Data2 from "../Objects/Data";
import Datas from "../Objects/Datas";
import Points from "../Objects/Points";

import StagingArea from "./Staging area";
import Chunk from "../Chunks/Chunk";
import Sprites from "../Sprites/Sprites";

export namespace GenTools {

	// To swap tile at ply in console
	// ~ Deline__.edit([Math.floor(ply.data.x), Math.floor(ply.data.y), 0], 'sideDash')
	export function getDataOfType(w: [number, number, number], type: Data2['type']) {

		let point = { x: w[0], y: w[1], z: w[2] };

		let chunk = Datas.getChunk(point);

		for (let data of chunk.datas) {
			if (data.type != type)
				continue;

			if (Points.different(data, point))
				continue;

			return data;
		}
	}

	export function swap2(min: [number, number, number], assign: object) {
		swap(min, min, assign);
	}

	export function swap(min: [number, number, number], max: [number, number, number], assign: object) {

		let x = min[0];
		for (; x <= max[0]; x++) {

			let y = min[1];
			for (; y <= max[1]; y++) {

				let point = Points.make(x, y);

				let chunk = Datas.getChunk(point);

				for (let data of chunk.datas) {

					if (Points.different(data, point))
						continue;

					//data.color = 'pink';

					Object.assign(data, assign);

					// Rebuild idiom
					chunk._remove(data);
					chunk._add(data);
				}

			}
		}
	}

	export namespace Deline {

		export function simple(w: [number, number, number], width, height) {

			let chunked: Chunk[] = [];

			let x = 0;
			for (; x < width; x++) {

				let y = 0;
				for (; y < height; y++) {

					let point = Points.make(w[0] + x, w[1] + y);

					let chunk = Datas.getChunk(point);

					for (let data of chunk.datas) {
						if ('Surface' != data.type)
							continue;
						if (Points.different(data, point))
							continue;

						if (data.sprite == Sprites.ROADS.SIDE_LINE) {
							data.sprite = Sprites.ROADS.SIDE_CLEAR;
						}

						if (data.sprite == Sprites.ROADS.CONVEX_LINE)
							data.sprite = Sprites.ROADS.CONVEX;

						if (data.sprite == Sprites.ROADS.SIDE_STOP_LINE) {
							data.sprite = Sprites.ROADS.SIDE_STOP;
						}

					}
				}
			}
		}

		export function aabb(min: [number, number, number], max: [number, number, number], axis) {
			horz(min, max[0] - min[0], max[1] - min[1], axis);
		}

		export function horz(w: [number, number, number], width, height, axis) {

			let chunked: Chunk[] = [];

			let x = 0;
			for (; x < width; x++) {

				let y = 0;
				for (; y < height; y++) {

					let p = { x: w[0] + x, y: w[1] + y };

					let chunk = Datas.getChunk(p);

					//if (chunked.includes(chunk))
					//continue;

					//chunked.push(chunk);

					for (let data of chunk.datas) {

						if ('Surface' != data.type)
							continue;

						if (Points.different(data, p))
							continue;

						//data.color = 'red';

						if (data.sprite == Sprites.ROADS.SIDE_LINE) {
							data.sprite = Sprites.ROADS.SIDE_CLEAR;
							if (axis == 0) {
								if (p.y == w[1] || p.y == w[1] + height - 1) {
									data.sprite = Sprites.ROADS.SIDE_DASH;
									//data.color = 'pink';

									if ((data.r == 1) && p.y == w[1] + height - 1)
										data.f = true;

									if ((data.r == 3) && p.y == w[1])
										data.f = true;
								}
							}

						}

						if (data.sprite == Sprites.ROADS.CONVEX_LINE)
							data.sprite = Sprites.ROADS.CONVEX;

						if (data.sprite == Sprites.ROADS.SIDE_STOP_LINE) {
							data.sprite = Sprites.ROADS.SIDE_STOP;
						}

					}
				}
			}
		}

	}
}

export default GenTools;