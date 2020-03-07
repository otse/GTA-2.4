import Data2 from "../Objects/Data";
import Datas from "../Objects/Datas";
import StagingArea from "./Staging area";

import Cars from "../Cars/Cars";
import Sprites, { SPRITES } from "../Sprites/Sprites";

export namespace Gen1 {

	type RoadMode = 'Normal' | 'Adapt';

	export var roadMode: RoadMode = 'Normal';

	export type Truple = [number, number, number];

	export enum Axis {
		Horz = 0,
		Vert = 1
	}

	export function invert(
		data: Data2,
		axis: Axis,
		w: [number, number, number]
	) {
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

	export namespace GenFlats {

		type Faces = [string, string, string, string, string];

		export const blueMetal: Faces = [
			'sty/metal/blue/340.bmp',
			'sty/metal/blue/340.bmp',
			'sty/metal/blue/340.bmp',
			'sty/metal/blue/340.bmp',
			'sty/metal/blue/340.bmp'];

		const roofFunc = (
			block: Data2,
			w: [number, number, number],
			min: [number, number, number],
			max: [number, number, number]) => {

			if (w[2] == max[2] - min[2] - 1) {
				block.faces![4] = 'sty/roofs/green/793.bmp';

				if (w[0] == min[0] && w[1] == min[1]) { // lb
					block.faces![4] = 'sty/roofs/green/784.bmp';
					block.r = 3;
				}
				else if (w[0] == min[0] + max[0] - 1 && w[1] == min[1] + max[1] - 1) { // rt
					block.faces![4] = 'sty/roofs/green/784.bmp';
					block.f = true;
					block.r = 0;
				}
				else if (w[0] == min[0] && w[1] == min[1] + max[1] - 1) { // lt
					block.faces![4] = 'sty/roofs/green/784.bmp';
					block.r = 0;
				}
				else if (w[0] == min[0] + max[0] - 1 && w[1] == min[1]) { // rb
					block.faces![4] = 'sty/roofs/green/784.bmp';
					block.r = 2;
				}

				else if (w[0] == min[0]) {
					block.faces![4] = 'sty/roofs/green/790.bmp';
					block.r = 1;
				}
				else if (w[1] == min[1] + max[1] - 1) {
					block.faces![4] = 'sty/roofs/green/790.bmp';
					block.f = true;
					block.r = 2;
				}
				else if (w[0] == min[0] + max[0] - 1) {
					block.faces![4] = 'sty/roofs/green/790.bmp';
					block.r = 3;
				}
				else if (w[1] == min[1]) {
					block.faces![4] = 'sty/roofs/green/790.bmp';
					block.r = 0;
				}
			}
		}

		export function type1(
			min: [number, number, number],
			max: [number, number, number],
		) {

			const func = (w: [number, number, number]) => {

				let bmp = 'sty/metal/blue/340.bmp';

				let block: Data2 = {
					type: 'Block',
					x: w[0],
					y: w[1],
					z: w[2]
				};

				block.faces = [];

				if (
					w[0] > min[0] &&
					w[0] < min[0] + max[0] - 1 &&
					w[1] > min[1] &&
					w[1] < min[1] + max[1] - 1 &&
					w[2] < min[2] + max[2] - 1
				)
					return;

				roofFunc(block, w, min, max);

				if (w[0] == min[0])
					block.faces[1] = bmp;
				if (w[1] == min[1] + max[1] - 1)
					block.faces[2] = bmp;
				if (w[0] == min[0] + max[0] - 1)
					block.faces[0] = bmp;
				if (w[1] == min[1])
					block.faces[3] = bmp;

				Datas.deliver(block);
			}

			Gen1.loop(min, max, func);
		}

	}

	export namespace GenRoads {

		export type Strings = 'badRoads' | 'greenRoads' | 'mixedRoads' | 'greyRoads';

		export function oneway(
			axis: 0 | 1,
			w: [number, number, number], segs: number, sheet: Strings
		) {
			let staging = new StagingArea;

			let seg = 0;
			for (; seg < segs; seg++) {

				let road: Data2 = {
					type: 'Surface',
					sheet: sheet,
					sprite: SPRITES.ROADS.SINGLE,
					x: w[0],
					y: seg + w[1],
					z: w[2],
					r: 3
				};

				road.adapt_sheet = roadMode == 'Adapt';

				if (!seg || seg == segs - 1) {
					road.sprite = SPRITES.ROADS.SINGLE_OPEN;

					if (!seg)
						road.r! += 1;

					else if (seg == segs - 1)
						road.r! -= 1;
				}

				staging.addData(road);
			}

			if (axis == 0)
				staging.ccw(1);

			staging.deliverAll();
		}

		export function twolane(
			axis: 0 | 1,
			w: [number, number, number], segs: number, sheet: Strings
		) {
			let staging = new StagingArea;

			const lanes = 2;

			let seg = 0;
			for (; seg < segs; seg++) {

				let lane = 0;
				for (; lane < lanes; lane++) {

					let road: Data2 = {
						type: 'Surface',
						sheet: sheet,
						sprite: SPRITES.ROADS.SIDE_LINE,
						x: seg + w[0],
						y: lane + w[1],
						z: 0,
						r: !lane ? 2 : 0
					};

					if (!seg || seg == segs - 1) {
						road.sprite = SPRITES.ROADS.CONVEX_LINE;

						road.adapt_sheet = roadMode == 'Adapt';

						if (!seg && lane ||
							seg == segs - 1 && !lane)
							road.r! += 1;
					}

					else if (lane == lanes - 1 && seg == 1 ||
						!lane && seg == segs - 2) {
						road.sprite = SPRITES.ROADS.SIDE_STOP_LINE; // sideStopLine
						road.f = true;
					}

					staging.addData(road);
				}
			}

			if (axis == 1)
				staging.ccw(1);

			staging.deliverAll();
		}

		export function highway(
			axis: 0 | 1,
			w: [number, number, number], segs: number, lanes: number,
			sheet: Strings
		) {
			let staging = new StagingArea;

			let seg = 0;
			for (; seg < segs; seg++) {

				let lane = 0;
				for (; lane < lanes; lane++) {

					let road: Data2 = {
						type: 'Surface',
						sheet: sheet,
						sprite: SPRITES.ROADS.SIDE_LINE,
						x: lane + w[0],
						y: seg + w[1],
						z: 0,
						r: !lane ? 3 : 1
					};

					if (lane > 0 && lane < lanes - 1)
						road.sprite = SPRITES.ROADS.MIDDLE_TRACKS;

					else if (!seg || seg == segs - 1) {
						road.sprite = SPRITES.ROADS.CONVEX_LINE;

						if (!seg && !lane ||
							seg == segs - 1 && lane)
							road.r! += 1;
					}

					/*else if (lane == lanes - 1 && seg == 1 ||
						!lane && seg == segs - 2) {
						road.square = 'sideStopLine';
					}*/

					staging.addData(road);
				}
			}

			if (axis == 0)
				staging.ccw(1);

			staging.deliverAll();
		}

	}

	export namespace GenParking {

		export function onewayRight(
			w: [number, number, number], segs: number, lanes: number, sheet: GenRoads.Strings) {

			let staging = new StagingArea;

			if (lanes < 2)
				console.warn('onewayRightVert less than 2 lanes');

			let seg = 0;
			for (; seg < segs; seg++) {

				let lane = 0;
				for (; lane < lanes; lane++) {

					let road: Data2 = {
						type: 'Surface',
						sheet: sheet,
						sprite: SPRITES.ROADS.SIDE_CLEAR,
						x: lane + w[0],
						y: seg + w[1],
						z: w[2],
						r: !lane ? 3 : 1
					};

					let parkedCar: Data2 = {
						type: 'Car',
						carName: Cars.GetRandomName(),
						x: road.x,
						y: road.y,
						z: road.z
					};

					let parkHere = false;

					if (!seg || seg == segs - 1) {
						if (!lane) {
							road.sprite = SPRITES.ROADS.SINGLE_OPEN;

							road.adapt_sheet = roadMode == 'Adapt';

							if (!seg)
								road.r! += 1;

							else if (seg == segs - 1)
								road.r! -= 1;
						}
						else {
							//road.square = 'sideLine';
							//road.r = !seg ? 0 : 2;
							continue; // Skip
						}
					}

					else if (seg == 1 || seg == segs - 2) {
						if (!lane) {
							road.sprite = SPRITES.ROADS.CUSTOM_NOTCH;

							road.r = 1;

							if (seg == 1)
								road.f = true;
						}
						else if (lane == lanes - 1) {
							road.sprite = SPRITES.ROADS.CORNER;
							road.r = seg == 1 ? 0 : 3;

							if (seg != 1) {
								parkedCar.r = Math.PI / 4;
								parkedCar.x = road.x + .5;
								parkedCar.y = road.y - .11;

								parkHere = true;
							}
						}
						else {
							road.r = seg == 1 ? 2 : 0;
						}
					}

					else if (lane) {
						if (lane == lanes - 1) {
							road.sprite = SPRITES.ROADS.PARKING_SPOT;

							parkedCar.r = Math.PI / 4;
							parkedCar.x = road.x + .5;
							parkedCar.y = road.y - .11;
							parkHere = true;
						}
						else
							road.sprite = SPRITES.ROADS.CLEAR;
					}

					if (parkHere && Math.random() < .75)
						staging.addData(parkedCar);

					staging.addData(road);
				}
			}

			staging.deliverAll();
		}

		export function leftBigHorz(
			w: [number, number, number], segs: number, lanes: number, sheet: GenRoads.Strings) {

			let staging = new StagingArea;

			lanes = 4;

			let seg = 0;
			for (; seg < segs; seg++) {

				let lane = 0;
				for (; lane < lanes; lane++) {

					let road: Data2 = {
						type: 'Surface',
						sheet: sheet,
						sprite: SPRITES.ROADS.SIDE_LINE,
						x: seg + w[0],
						y: lane + w[1],
						z: w[2],
						r: 1
					};

					let parkedCar: Data2 = {
						type: 'Car',
						carName: Cars.GetRandomName(),
						x: road.x,
						y: road.y,
						z: road.z
					};

					let parkHere = false;

					if (!seg) {
						road.adapt_sheet = roadMode == 'Adapt';

						if (lane == 1) {
							road.sprite = SPRITES.ROADS.CONVEX_LINE;
							road.r! += 1;
						}
						else if (lane == 2) {
							road.sprite = SPRITES.ROADS.CONVEX_LINE;
						}
						else {
							continue;
						}
					}
					else if (seg == 1) {
						if (lane == 1) {
							road.sprite = SPRITES.ROADS.SIDE_LINE;
							road.r! += 1;
						}
						else if (lane == 2) {
							road.sprite = SPRITES.ROADS.SIDE_LINE;
							road.r! -= 1;
						}
						else {
							continue;
						}
					}
					else if (seg == 2) {
						if (lane == 0) {
							road.sprite = SPRITES.ROADS.CORNER;

							parkHere = true;
							parkedCar.r = Math.PI / 4;
							parkedCar.x = road.x + 0.5 + 0.6;
							parkedCar.y = road.y + 0.5;

						}
						else if (lane == 1) {
							road.sprite = SPRITES.ROADS.CONVEX_LINE;
							road.r! += 2;
						}
						else if (lane == 2) {
							road.sprite = SPRITES.ROADS.CONVEX_LINE;
							road.r! -= 1;

						}
						else if (lane == 3) {
							road.sprite = SPRITES.ROADS.CORNER;
							road.r! += 1;

							parkHere = true;
							parkedCar.r = Math.PI - Math.PI / 4;
							parkedCar.x = road.x + 0.5 + 0.6;
							parkedCar.y = road.y + 0.5;
						}
					}
					else if (seg == segs - 1) {
						if (lane == 0) {
							road.sprite = SPRITES.ROADS.CORNER;
							road.r! -= 1;
						}
						else if (lane == 3) {
							road.sprite = SPRITES.ROADS.CORNER;
							road.r! += 2;
						}
						else {
							road.sprite = SPRITES.ROADS.SIDE_CLEAR;
						}

					}
					else if (lane == 1 || lane == 2) {
						road.sprite = SPRITES.ROADS.CLEAR;
					}
					else if (lane != 1) {
						road.sprite = SPRITES.ROADS.PARKING_SPOT;

						parkHere = true;

						// Bottom
						if (!lane) {
							road.r! += 1;
							road.f = true;

							parkedCar.r = Math.PI / 4;
							parkedCar.x = road.x + 0.5 + 0.6;
							parkedCar.y = road.y + 0.5;
						}
						// Top
						else {
							road.r! -= 1;

							parkedCar.r = Math.PI - Math.PI / 4;
							parkedCar.x = road.x + 0.5 + 0.6;
							parkedCar.y = road.y + 0.5;
						}

					}

					if (parkHere && Math.random() > .5)
						staging.addData(parkedCar);

					staging.addData(road);
				}
			}

			staging.deliverAll();
		}

	}

}

export default Gen1;