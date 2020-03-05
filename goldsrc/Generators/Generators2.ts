import Data2 from "../Objects/Data";
import Datas from "../Objects/Datas";
import Points from "../Objects/Points";

import StagingArea from "./Staging area";
import Chunk from "../Chunks/Chunk";

export namespace Gen2 {

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

	export function swap(w: [number, number, number], assign: object) {

		let point = { x: w[0], y: w[1] };

		let chunk = Datas.getChunk(point);

		for (let data of chunk.datas) {

			if ('Surface' != data.type)
				continue;

			if (Points.different(data, point))
				continue;

			Object.assign(data, assign);

			console.log('Deline Swap complete');

			// Rebuild idiom
			chunk.remove(data);
			chunk.add(data);

			break;

		}
	}

	export namespace GenPlaza {

		export function fill(
			w: [number, number, number],
			width, height,
			sty = 'sty/floors/blue/256.bmp'
			) {
	
			//const lanes = 1;
	
			let x = 0;
			for (; x < width; x++) {
	
				let y = 0;
				for (; y < height; y++) {
	
					let pav: Data2 = {
						type: 'Surface',
						//sheet: 'yellowyPavement',
						//square: 'middle',
						sty: sty,
						x: x + w[0],
						y: y + w[1],
						z: w[2],
					};
	
					Datas.deliver(pav);
				}
			}
			
		}
	
	}

	export namespace GenDeline {

		export function simple(w: [number, number, number], width, height) {
	
			let chunked: Chunk[] = [];
	
			let x = 0;
			for (; x < width; x++) {
	
				let y = 0;
				for (; y < height; y++) {
	
					let point = { x: w[0] + x, y: w[1] + y };
	
					let chunk = Datas.getChunk(point);
	
					for (let data of chunk.datas) {
						if ('Surface' != data.type)
							continue;
						if (Points.different(data, point))
							continue;
	
						if (data.square == 'sideLine') {
							data.square = 'sideClear';
						}
	
						if (data.square == 'convexLine')
							data.square = 'convex';
	
						if (data.square == 'sideStopLine') {
							data.square = 'sideStop';
						}
	
					}
				}
			}
		}

		export function horz(w: [number, number, number], width, height) {
	
			let chunked: Chunk[] = [];
	
			let x = 0;
			for (; x < width; x++) {
	
				let y = 0;
				for (; y < height; y++) {
	
					let point = { x: w[0] + x, y: w[1] + y };
	
					let chunk = Datas.getChunk(point);
	
					//if (chunked.includes(chunk))
					//continue;
	
					//chunked.push(chunk);
	
					for (let data of chunk.datas) {
	
						if ('Surface' != data.type)
							continue;
	
						if (Points.different(data, point))
							continue;
	
						if (data.square == 'sideLine') {
							data.square = 'sideClear';
							if (point.x == w[0] || point.x == w[0] + width - 1) {
								data.square = 'sideDash';
								if (point.x == w[0] + width - 1 && point.y == w[1])
									data.f = true;
								if (point.x == w[0] && point.y == w[1] + height - 1)
									data.f = true;
							}
						}
	
						if (data.square == 'convexLine')
							data.square = 'convex';
	
						if (data.square == 'sideStopLine') {
							data.square = 'sideStop';
						}
	
					}
				}
			}
		}
	
		export function mixedToBad(w: [number, number, number], width, height) {
	
			let chunked: Chunk[] = [];
	
			let x = 0;
			for (; x < width; x++) {
	
				let y = 0;
				for (; y < height; y++) {
	
					let point = { x: w[0] + x, y: w[1] + y };
	
					let chunk = Datas.getChunk(point);
	
					//if (chunked.includes(chunk))
					//continue;
	
					//chunked.push(chunk);
	
					for (let data of chunk.datas) {
	
						if ('Surface' != data.type)
							continue;
	
						if (Points.different(data, point))
							continue;
	
						if (Math.random() > .5)
							continue;
	
						if (
							data.sheet == 'mixedRoads' &&
							data.square!.indexOf('side') > -1) {
	
							data.sheet = 'badRoads';
	
							//if (Math.random() > .25)
							//continue;
	
							//if (data.square != 'sideDash')
							//data.square = Math.random() > .5 ? 'sideDecal' : 'sideDecal_2';
						}
	
					}
				}
			}
		}
	
		export function EditMultiple(w: [number, number, number], width, height, square_a, square_b) {
	
			let chunked: Chunk[] = [];
	
			let x = 0;
			for (; x < width; x++) {
	
				let y = 0;
				for (; y < height; y++) {
	
					let point = { x: w[0] + x, y: w[1] + y };
	
					let chunk = Datas.getChunk(point);
	
					//if (chunked.includes(chunk))
					//continue;
	
					//chunked.push(chunk);
	
					for (let data of chunk.datas) {
	
						if ('Surface' != data.type)
							continue;
	
						if (Points.different(data, point))
							continue;
	
						if (data.square == 'sideLine')
							data.square = 'sideClear';
	
						else if (data.square == 'sideStopLine')
							data.square = 'sideStop';
	
					}
				}
			}
		}
	
	}

	export namespace GenPavements {

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
						square: 'middle',
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
						square: 'middle',
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
						square: 'middle',
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

export default Gen2;