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
import Cinematics from "./Cinematics/Cinematics";
import BridgeScenario from "./Scenarios/Bridge";
import Scenarios from "./Scenarios/Scenarios";
import Letterer from "./Cinematics/Letterer";
import { Rain as Rain } from "./Unsorted/Minecraft rain";
import Water from "./Unsorted/Water";
import Mist from "./Unsorted/Mist";

export namespace KILL {

	export var ply: Ply | null;
	export var city: City;

	var started = false;

	export enum RESOURCES {
		UNDEFINED_OR_INIT = 0,
		SMALL_FONT,
		BIG_FONT,
		SPRITES,
		COUNT
	};

	let words = 0b0;

	export function resourced(word: string) {

		let mask: RESOURCES = RESOURCES[word];

		const bit = 0b1 << mask;

		words |= bit;

		can_we_begin_yet();
	}

	function can_we_begin_yet() {

		let count = 0;

		let i = 0;
		for (; i < RESOURCES.COUNT; i++)
			(words & 0b1 << i) ? count++ : void (0);

		if (count == RESOURCES.COUNT)
			start();
	}

	export function critical(mask: string) {

		console.error('resource', mask);

	}

	export function init() {
		console.log('kill init');

		resourced('UNDEFINED_OR_INIT');

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

		Water.init();
		Mist.init();
		Rain.init();

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

		Water.update();
		Mist.update();
		Rain.update();

		Zoom.update();

		Scenarios.update();

		city.update(ply!.data);
	}

}

export default KILL;