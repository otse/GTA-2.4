import Data2 from "./Objects/Data";
import City from "./Chunks/City";
import Ply from "./Pawns/Ply";

import Zoom from "./Unsorted/Zoom";
import Phong2 from "./Shaders/Phong2";
import Rectangles from "./Objects/Rectangles";
import Surfaces from "./Objects/Shapes/Surfaces";
import Blocks from "./Objects/Shapes/Blocks";
import BoxCutter from "./Objects/Shapes/Box cutter";
import Spritesheets from "./Sprites/Spritesheets";

export namespace KILL {

	export var ply: Ply;
	export var city: City;
	
	export function init() {
		console.log('gta init');

		Phong2.rig();
		Rectangles.init();
		Surfaces.init();
		Blocks.init();
		BoxCutter.init();
		Spritesheets.init();
		
		city = new City;

		let data: Data2 = {
			type: 'Ply',
			x: 10.5,
			y: 1
		};
		data.remap = [40, 46, 47, 49, 50, 51][Math.floor(Math.random() * 6)];

		ply = new Ply(data);

		city.chunkList.get2(0, 0);
		city.chunkList.get2(0, 1);
	}

	export function update() {
		
		if (ply)
			ply.update();

		Zoom.update();

		city.update(ply.data);
	}

}

export default KILL;