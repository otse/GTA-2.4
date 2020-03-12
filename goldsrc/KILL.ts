import Data2 from "./Objects/Data";
import City from "./Chunks/City";
import Ply from "./Pawns/Ply";

import Phong2 from "./Shaders/Phong2";
import Rectangles from "./Objects/Rectangles";
import Surfaces from "./Objects/Shapes/Surfaces";
import Blocks from "./Objects/Shapes/Blocks";
import BoxCutter from "./Objects/Shapes/Box cutter";
import Sprites from "./Sprites/Sprites";
import Sheets from "./Sprites/Sheets";

import Levels from "./Generators/Levels";

import Zoom from "./Unsorted/Zoom";
import { Movie } from "./Unsorted/RGB Shift";
import PalmTrees from "./Scenarios/Palm trees";
import HighWayWithEveryCar from "./Scenarios/Highway";
import { Cinematics } from "./Cinematics/Cinematics";
import BridgeScenario from "./Scenarios/Bridge";
import { Scenarios } from "./Scenarios/Scenarios";
import { Letterer } from "./Unsorted/Letterer";

export namespace KILL {

	export var ply: Ply | null;
	export var city: City;

	var ready = false;

	export enum MASKS {
		FONTS = 0,
		//AUDIOS,
		COUNT
	}

	let systems = 0b0;

	export function checkin(mask: MASKS) {

		console.log('check-in ', mask);

		const bit = 0b1 << mask;

		systems |= bit;
	}

	function checkins() {
		let count = 0;

		let i = 0;
		for (; i < MASKS.COUNT; i++) {
			(systems & 0b1 << i) ? count++ : void (0);
		}

		if (count == MASKS.COUNT) {
			ready = true;
			start();
		}
	}

	export function init() {
		console.log('kill init');

		Phong2.rig();
		Rectangles.init();
		Surfaces.init();
		Blocks.init();
		BoxCutter.init();
		Sprites.init();
		Sheets.init();
		Cinematics.init();
		Letterer.init();
		Movie.init();

		city = new City;

		(window as any).KILL = KILL;
	}

	export function start() {

		console.log('start');

		BridgeScenario.init();

		let data: Data2 = {
			type: 'Ply',
			x: 10.5,
			y: 1,
			z: 0
		};
		data.remap = [40, 46, 47, 49, 50, 51][Math.floor(Math.random() * 6)];

		ply = new Ply(data);

		city.chunkList.get2(0, 0);
		city.chunkList.get2(0, 1);
	}

	export function update() {

		if (!ready) {
			checkins();
			return;
		}

		if (ply)
			ply.update();

		Zoom.update();

		Scenarios.update();

		city.update(ply!.data);
	}

}

export default KILL;