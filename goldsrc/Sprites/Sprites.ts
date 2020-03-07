import Spritesheet from "./Spritesheet";


export namespace SPRITES {
	export function NN(a: number, b: number): Square {
		return { x: a, y: b };
	}

	export const ROADS = {
		CLEAR: NN(1, 2),
		MIDDLE_TRACKS: NN(2, 2),
		MIDDLE_CORNER: NN(3, 2),
		SIDE_CLEAR: NN(1, 1),
		SIDE_CLEAR_ALT: NN(1, 1),
		SIDE_LINE: NN(4, 1),
		SIDE_DASH: NN(3, 1),
		SIDE_STOP: NN(2, 4),
		SIDE_STOP_LINE: NN(5, 1),
		SIDE_STOP_DASH: NN(5, 2),
		PARKING_SPOT: NN(1, 4),
		CUSTOM_NOTCH: NN(3, 4),
		SINGLE: NN(1, 3),
		SINGLE_EXIT: NN(2, 3),
		SINGLE_CORNER: NN(3, 3),
		SINGLE_OPEN: NN(3, 5),
		CORNER: NN(4, 3),
		CONVEX: NN(4, 5),
		CONVEX_LINE: NN(5, 5),
		SIDE_DECAL: NN(1, 5),
		SIDE_DECAL_2: NN(2, 5)
	};

	export const PAVEMENTS = {
		MIDDLE: NN(1, 1),
		SIDE_SHADOWED: NN(2, 1),
		SIDE_PAVED: NN(3, 1),
		SIDE_PAVED_SHADOWED: NN(4, 1),
		SIDE_PAVED_SHADOWED_VENT: NN(3, 3),
		SIDE_LINE_END: NN(3, 1)
	}
}

export namespace Sprites {

	type List = { [index: string]: Spritesheet }

	export function getSheet(name: string): Readonly<Spritesheet> | undefined {
		if (!name)
			return;

		let value = sheets[name];

		if (!value)
			console.warn('Spritesheet not found');

		return value;
	}

	export var canvas;

	export function init() {
		canvas = document.createElement('canvas');

		document.body.appendChild(canvas);

		console.log('Spritesheets init');
	}

	const sheets: Readonly<List> = {
		badRoads: {
			file: 'sty/sheets/bad_roads.png',
			width: 320,
			height: 320,
			piece: { w: 64, h: 64 }
		},

		greenRoads: {
			file: 'sty/sheets/green_roads.png',
			width: 320,
			height: 320,
			piece: { w: 64, h: 64 }
		},

		mixedRoads: {
			file: 'sty/sheets/mixed_roads.png',
			width: 320,
			height: 320,
			piece: { w: 64, h: 64 }
		},

		greyRoads: {
			file: 'sty/sheets/grey_roads.png',
			width: 320,
			height: 320,
			piece: { w: 64, h: 64 }
		},

		yellowyPavement: {
			file: 'sty/sheets/yellowy_pavement.png',
			width: 256,
			height: 256,
			piece: { w: 64, h: 64 }
		},

		greenPavement: {
			file: 'sty/sheets/green_pavement.png',
			width: 256,
			height: 256,
			piece: { w: 64, h: 64 }
		}
	}

}

export default Sprites;