import Data2 from "../Objects/Data";
import Datas from "../Objects/Datas";
import StagingArea from "./Staging area";

import Cars from "../Cars/Cars";
import Sprites from "../Sprites/Sprites";
import KILL from "../KILL";

const parkedCarNames: string[] = [
	"Romero", "Wellard", "Aniston BD4", /*"Pacifier",
	"G4 Bank Van",*/ "Beamer", /*"Box Car", "Box Truck",*/
	"Bug", "Bulwark", /*"Bus",*/ "Cop Car",
	"Minx", "Eddy", "Panto", /*"Fire Truck",*/
	"Shark", "GT-A1", /*"Garbage Truck", "Armed Land Roamer",*/
	/*"Hot Dog Van", "Ice-Cream Van", "Dementia Limousine",*/ "Dementia",
	"Land Roamer", "Jefferson", /*"Stretch Limousine", "Sports Limousine",*/
	/*"Medicar",*/ "Benson", "Schmidt", "Miara",
	"Big Bug", "Morton", "Maurice", "Pickup",
	"A-Type", "Arachnid", "Spritzer", "Stinger",
	"Meteor", /*"Meteor Twoo?",*/ "Hachura", "B-Type",
	"Taxi Xpress", /*"SWAT Van",*/ "Michelli Roadster", /*"Tank",
	"Tanker",*/ "Taxi", "T-Rex", /*"Tow Truck",*/
	/*"Train", "Train Cab", "Train FB",*/ "Trance-Am",
	/*"Truck Cab", "Truck Cab SX", "Container", "Transporter",*/
	"TV Van", "Van", "U-Jerk Truck", "Z-Type",
	"Rumbler", /*"Wreck 0", "Wreck 1", "Wreck 2",
	"Wreck 3", "Wreck 4", "Wreck 5", "Wreck 6",
	"Wreck 7", "Wreck 8", "Wreck 9",*/ "Jagular XK",
	"Furore GT", "Special Agent Car"/*, "Karma Bus",*/
];

export namespace Generators {

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

		let x = min[0];
		for (; x <= max[0]; x++) {

			let y = min[1];
			for (; y <= max[1]; y++) {

				let z = min[2];
				for (; z <= max[2]; z++) {

					func([x, y, z]);

				}
			}
		}
	}

	export namespace Interiors {

		export function generate(
			min: [number, number, number],
			max: [number, number, number],
			style: string
		) {

			let staging = new StagingArea;

			const func = (p: [number, number, number]) => {

				if (
					p[0] > min[0] &&
					p[0] < max[0] &&
					p[1] > min[1] &&
					p[1] < max[1]
				) { }
				else {
					let wall: Data2 = {
						type: 'Wall',
						style: style,
						x: p[0],
						y: p[1],
						z: p[2]
					};

					wallFunc(wall, p, min, max);

					staging.addData(wall);
				}
			}

			Generators.loop(min, max, func);

			staging.deliverKeep();
		}

		const wallFunc = (
			data: Data2,
			p: [number, number, number],
			min: [number, number, number],
			max: [number, number, number]) => {

			if (p[0] == min[0] && p[1] == min[1]) { // lb
				data.wall = 'concave';
				data.r = 3;
			}
			else if (p[0] == max[0] && p[1] == max[1]) { // rt
				data.wall = 'concave';
				data.f = true;
				data.r = 0;
			}
			else if (p[0] == min[0] && p[1] == max[1]) { // lt
				data.wall = 'concave';
				data.r = 0;
			}
			else if (p[0] == max[0] && p[1] == min[1]) { // rb
				data.wall = 'concave';
				data.r = 2;
			}

			else if (p[0] == min[0]) {
				data.wall = 'side';
				data.r = 3;
			}
			else if (p[1] == max[1]) {
				data.wall = 'side';
				data.f = true;
				data.r = 0;
			}
			else if (p[0] == max[0]) {
				data.wall = 'side';
				data.r = 1;
			}
			else if (p[1] == min[1]) {
				data.wall = 'side';
				data.r = 2;
			}
		}

	}

	export namespace Buildings {

		type Faces = [string, string, string, string, string];

		export const blueMetal: Faces = [
			'sty/metal/blue/340.bmp',
			'sty/metal/blue/340.bmp',
			'sty/metal/blue/340.bmp',
			'sty/metal/blue/340.bmp',
			'sty/metal/blue/340.bmp'];

		const roofFunc = (
			block: Data2,
			p: [number, number, number],
			min: [number, number, number],
			max: [number, number, number]) => {

			if (p[2] == max[2]) {
				block.faces![4] = 'sty/roofs/green/793.bmp';

				if (p[0] == min[0] && p[1] == min[1]) { // lb
					block.faces![4] = 'sty/roofs/green/784.bmp';
					block.r = 3;
				}
				else if (p[0] == max[0] && p[1] == max[1]) { // rt
					block.faces![4] = 'sty/roofs/green/784.bmp';
					block.f = true;
					block.r = 0;
				}
				else if (p[0] == min[0] && p[1] == max[1]) { // lt
					block.faces![4] = 'sty/roofs/green/784.bmp';
					block.r = 0;
				}
				else if (p[0] == max[0] && p[1] == min[1]) { // rb
					block.faces![4] = 'sty/roofs/green/784.bmp';
					block.r = 2;
				}

				else if (p[0] == min[0]) {
					block.faces![4] = 'sty/roofs/green/790.bmp';
					block.r = 1;
				}
				else if (p[1] == max[1]) {
					block.faces![4] = 'sty/roofs/green/790.bmp';
					block.f = true;
					block.r = 2;
				}
				else if (p[0] == max[0]) {
					block.faces![4] = 'sty/roofs/green/790.bmp';
					block.r = 3;
				}
				else if (p[1] == min[1]) {
					block.faces![4] = 'sty/roofs/green/790.bmp';
					block.r = 0;
				}
			}
		}

		export function type1(
			min: [number, number, number],
			max: [number, number, number],
		) {

			const func = (p: [number, number, number]) => {

				let bmp = 'sty/metal/blue/340.bmp';

				let block: Data2 = {
					type: 'Block',
					x: p[0],
					y: p[1],
					z: p[2]
				};

				block.faces = [];

				if (
					p[0] > min[0] &&
					p[0] < max[0] &&
					p[1] > min[1] &&
					p[1] < max[1] &&
					p[2] < max[2]
				)
					return;

				roofFunc(block, p, min, max);

				if (p[0] == min[0])
					block.faces[1] = bmp;
				if (p[1] == max[1])
					block.faces[2] = bmp;
				if (p[0] == max[0])
					block.faces[0] = bmp;
				if (p[1] == min[1])
					block.faces[3] = bmp;

				Datas.deliver(block);
			}

			Generators.loop(min, max, func);
		}

	}

	export namespace Roads {

		export type Strings = 'badRoads' | 'greenRoads' | 'blueRoads' | 'qualityRoads' | 'mixedRoads' | 'greyRoads' | 'greyRoadsMixed';

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
					sprite: Sprites.ROADS.SINGLE,
					x: w[0],
					y: seg + w[1],
					z: w[2],
					r: 3
				};

				road.adapt_sheet = roadMode == 'Adapt';

				if (!seg || seg == segs - 1) {
					road.sprite = Sprites.ROADS.SINGLE_OPEN;

					if (!seg)
						road.r! += 1;

					else if (seg == segs - 1)
						road.r! -= 1;
				}

				staging.addData(road);
			}

			if (axis == 0)
				staging.ccw(1);

			staging.deliverReplace();
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
						sprite: Sprites.ROADS.SIDE_LINE,
						x: seg + w[0],
						y: lane + w[1],
						z: 0,
						r: !lane ? 2 : 0
					};

					if (!seg || seg == segs - 1) {
						road.sprite = Sprites.ROADS.CONVEX_LINE;

						road.adapt_sheet = roadMode == 'Adapt';

						if (!seg && lane ||
							seg == segs - 1 && !lane)
							road.r! += 1;
					}

					else if (lane == lanes - 1 && seg == 1 ||
						!lane && seg == segs - 2) {
						road.sprite = Sprites.ROADS.SIDE_STOP_LINE; // sideStopLine
						road.f = true;
					}

					staging.addData(road);
				}
			}

			if (axis == 1)
				staging.ccw(1);

			staging.deliverReplace();
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
						sprite: Sprites.ROADS.SIDE_LINE,
						x: lane + w[0],
						y: seg + w[1],
						z: 0,
						r: !lane ? 3 : 1
					};

					if (lane > 0 && lane < lanes - 1)
						road.sprite = Sprites.ROADS.MIDDLE_TRACKS;

					else if (!seg || seg == segs - 1) {
						road.sprite = Sprites.ROADS.CONVEX_LINE;

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

			staging.deliverReplace();
		}

	}

	export namespace Parking {

		export function onewayRight(
			w: [number, number, number], segs: number, lanes: number, sheet: Roads.Strings) {

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
						sprite: Sprites.ROADS.SIDE_CLEAR,
						x: lane + w[0],
						y: seg + w[1],
						z: w[2],
						r: !lane ? 3 : 1
					};

					let randomCar = parkedCarNames[KILL.floor_random(parkedCarNames.length)];

					let parkedCar: Data2 = {
						type: 'Car',
						car: randomCar,
						x: road.x,
						y: road.y,
						z: road.z
					};

					let parkHere = false;

					if (!seg || seg == segs - 1) {
						if (!lane) {
							road.sprite = Sprites.ROADS.SINGLE_OPEN;

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
							road.sprite = Sprites.ROADS.CUSTOM_NOTCH;

							road.r = 1;

							if (seg == 1)
								road.f = true;
						}
						else if (lane == lanes - 1) {
							road.sprite = Sprites.ROADS.CORNER;
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
							road.sprite = Sprites.ROADS.PARKING_SPOT;

							parkedCar.r = Math.PI / 4;
							parkedCar.x = road.x + .5;
							parkedCar.y = road.y - .11;
							parkHere = true;
						}
						else
							road.sprite = Sprites.ROADS.CLEAR;
					}

					if (parkHere && Math.random() < .75)
						staging.addData(parkedCar);

					staging.addData(road);
				}
			}

			staging.deliverReplace();
		}

		export function leftBigHorz(
			w: [number, number, number], segs: number, lanes: number, sheet: Roads.Strings) {

			let staging = new StagingArea;

			lanes = 4;

			let seg = 0;
			for (; seg < segs; seg++) {

				let lane = 0;
				for (; lane < lanes; lane++) {

					let road: Data2 = {
						type: 'Surface',
						sheet: sheet,
						sprite: Sprites.ROADS.SIDE_LINE,
						x: seg + w[0],
						y: lane + w[1],
						z: w[2],
						r: 1
					};
					
					let randomCar = parkedCarNames[KILL.floor_random(parkedCarNames.length)];

					let parkedCar: Data2 = {
						type: 'Car',
						car: randomCar,
						x: road.x,
						y: road.y,
						z: road.z
					};

					let parkHere = false;

					if (!seg) {
						road.adapt_sheet = roadMode == 'Adapt';

						if (lane == 1) {
							road.sprite = Sprites.ROADS.CONVEX_LINE;
							road.r! += 1;
						}
						else if (lane == 2) {
							road.sprite = Sprites.ROADS.CONVEX_LINE;
						}
						else {
							continue;
						}
					}
					else if (seg == 1) {
						if (lane == 1) {
							road.sprite = Sprites.ROADS.SIDE_LINE;
							road.r! += 1;
						}
						else if (lane == 2) {
							road.sprite = Sprites.ROADS.SIDE_LINE;
							road.r! -= 1;
						}
						else {
							continue;
						}
					}
					else if (seg == 2) {
						if (lane == 0) {
							road.sprite = Sprites.ROADS.CORNER;

							parkHere = true;
							parkedCar.r = Math.PI / 4;
							parkedCar.x = road.x + 0.5 + 0.6;
							parkedCar.y = road.y + 0.5;

						}
						else if (lane == 1) {
							road.sprite = Sprites.ROADS.CONVEX_LINE;
							road.r! += 2;
						}
						else if (lane == 2) {
							road.sprite = Sprites.ROADS.CONVEX_LINE;
							road.r! -= 1;

						}
						else if (lane == 3) {
							road.sprite = Sprites.ROADS.CORNER;
							road.r! += 1;

							parkHere = true;
							parkedCar.r = Math.PI - Math.PI / 4;
							parkedCar.x = road.x + 0.5 + 0.6;
							parkedCar.y = road.y + 0.5;
						}
					}
					else if (seg == segs - 1) {
						if (lane == 0) {
							road.sprite = Sprites.ROADS.CORNER;
							road.r! -= 1;
						}
						else if (lane == 3) {
							road.sprite = Sprites.ROADS.CORNER;
							road.r! += 2;
						}
						else {
							road.sprite = Sprites.ROADS.SIDE_CLEAR;
						}

					}
					else if (lane == 1 || lane == 2) {
						road.sprite = Sprites.ROADS.CLEAR;
					}
					else if (lane != 1) {
						road.sprite = Sprites.ROADS.PARKING_SPOT;

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

			staging.deliverReplace();
		}

	}

	export namespace Fill {

		interface Extras {
			WHEEL?: boolean;
		}

		export function fill1(
			min: [number, number, number],
			object: object,
			extras: Extras = {}
		) {
			fill(min, min, object, extras);
		}

		export function fill(
			min: [number, number, number],
			max: [number, number, number],
			object: object,
			extras: Extras = {}
		) {
			let staging = new StagingArea;

			//const lanes = 1;

			let x = min[0];
			for (; x <= max[0]; x++) {

				let y = min[1];
				for (; y <= max[1]; y++) {

					let pav: Data2 = {
						type: 'Surface',
						x: x,
						y: y,
						z: min[2],
					};

					Object.assign(pav, object);

					if (extras.WHEEL)
						pav.r = KILL.floor_random(4);

					staging.addData(pav);
				}
			}

			staging.deliverReplace();
		}

	}

	export namespace Pavements {

		export function fill(
			w: [number, number, number],
			width, height) {

			//const lanes = 1;

			let x = 0;
			for (; x < width; x++) {

				let y = 0;
				for (; y < height; y++) {

					let pav: Data2 = {
						type: 'Surface',
						sheet: 'yellowyPavement',
						sprite: Sprites.PAVEMENTS.MIDDLE,
						//sty: 'sty/floors/blue/256.bmp',
						x: x + w[0],
						y: y + w[1],
						z: w[2],
					};

					Datas.deliver(pav);
				}
			}

		}

		export function vert(x, y, z, segs, lanes) {

			//const lanes = 1;

			let seg = 0;
			for (; seg < segs; seg++) {

				let lane = 0;
				for (; lane < lanes; lane++) {

					let pav: Data2 = {
						type: 'Surface',
						sheet: 'yellowyPavement',
						sprite: Sprites.PAVEMENTS.MIDDLE,
						//sty: 'sty/floors/blue/256.bmp',
						x: lane + x,
						y: seg + y,
						z: 0
					};

					Datas.deliver(pav);

				}
			}
		}

		export function Horz(x, y, z, segs, lanes) {

			//const lanes = 1;

			let seg = 0;
			for (; seg < segs; seg++) {

				let lane = 0;
				for (; lane < lanes; lane++) {

					let pav: Data2 = {
						type: 'Surface',
						sheet: 'yellowyPavement',
						sprite: Sprites.PAVEMENTS.MIDDLE,
						//sty: 'sty/floors/blue/256.bmp',
						x: seg + y,
						y: lane + x,
						z: 0
					};

					Datas.deliver(pav);

				}
			}
		}

	}

}

export default Generators;