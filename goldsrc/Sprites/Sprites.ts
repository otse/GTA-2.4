import Spritesheet from "./Spritesheet";

function SPRITE(a: number, b: number): Square {
	return { x: a, y: b };
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

	export const Roads = {
		clear: SPRITE(1, 2),
		middleTracks: SPRITE(2, 2),
		middleCorner: SPRITE(3, 2),
		sideClear: SPRITE(1, 1),
		sideClearAlt: SPRITE(1, 1),
		sideLine: SPRITE(4, 1),
		sideDash: SPRITE(3, 1),
		sideStop: SPRITE(2, 4),
		sideStopLine: SPRITE(5, 1),
		sideStopDash: SPRITE(5, 2),
		parkingSpot: SPRITE(1, 4),
		customNotch: SPRITE(3, 4),
		single: SPRITE(1, 3),
		singleExit: SPRITE(2, 3),
		singleCorner: SPRITE(3, 3),
		singleOpen: SPRITE(3, 5),
		corner: SPRITE(4, 3),
		convex: SPRITE(4, 5),
		convexLine: SPRITE(5, 5),
		sideDecal: SPRITE(1, 5),
		sideDecal_2: SPRITE(2, 5)
	};

	export const Pavements = {
		middle: SPRITE(1, 1),
		sideShadowed: SPRITE(2, 1),
		sidePaved: SPRITE(3, 1),
		sidePavedShadowed: SPRITE(4, 1),
		sidePavedShadowedVent: SPRITE(3, 3),
		sideLineEnd: SPRITE(3, 1)
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