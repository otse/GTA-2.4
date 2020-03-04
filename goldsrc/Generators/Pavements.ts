import Data2 from "../Objects/Data";
import Datas from "../Objects/Datas";

export namespace GenPavements {

	export function Fill(
		w: [number, number, number], width, height) {

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

	export function Vert(x, y, z, segs, lanes) {

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
					y: seg + y
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
				};
				
				Datas.deliver(pav);

			}
		}
	}

}

export default GenPavements;