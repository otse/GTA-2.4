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
import { Letterer } from "./Cinematics/Letterer";

export namespace KILL {

	export var ply: Ply | null;
	export var city: City;

	var started = false;

	export enum MASKS {
		UNDEFINED_OR_INIT = 0,
		FONTS,
		SPRITES,
		COUNT
	};

	let words = 0b0;

	export function checkin(word: string) {

		let mask: MASKS = (<any>MASKS)[word];

		const bit = 0b1 << mask;

		words |= bit;
		
		checkins();
	}

	function checkins() {

		let count = 0;

		let i = 0;
		for (; i < MASKS.COUNT; i++)
			(words & 0b1 << i) ? count++ : void (0);

		if (count == MASKS.COUNT)
			start();
	}

	export function fault(mask: string) {

		console.error('fault ', mask);

	}

	export function init() {
		console.log('kill init');

		checkin('UNDEFINED_OR_INIT');

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
	}

	export function start() {

		if (started)
			return;

		console.log('kill starting');

		started = true;

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

		if (!started)
			return;

		if (ply)
			ply.update();

		Zoom.update();

		Scenarios.update();

		city.update(ply!.data);
	}

}

export default KILL;