import Data2 from "../Objects/Data";
import Datas from "../Objects/Datas";

export namespace GenPlaza {

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

}

export default GenPlaza;