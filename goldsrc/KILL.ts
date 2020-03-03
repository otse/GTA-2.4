import Data2 from "./Objects/Data";
import City from "./Chunks/City";
import Ply from "./Pawns/Ply";

import Zoom from "./Unsorted/Zoom";

export namespace KILL {

	export var ply: Ply;
	export var city: City;
	
	export function init() {
		console.log('gta init');
		
		city = new City;

		let data: Data2 = {
			type: 'Ply',
			x: 10.5,
			y: 1
		};
		data.remap = [40, 46, 47, 49, 50, 51][Math.floor(Math.random() * 6)];

		ply = new Ply(data);

		city.chunkList.Get2(0, 0);
		city.chunkList.Get2(0, 1);
	}

	export function update() {
		Zoom.update();

		city.update(ply.data);
	}

}

export default KILL;