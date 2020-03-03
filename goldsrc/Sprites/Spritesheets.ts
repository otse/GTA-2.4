import Spritesheet from "./Spritesheet";

export namespace Spritesheets {

	type List = { [index: string]: Spritesheet }

    export function Get(index: string | undefined): Readonly<Spritesheet> | undefined {
		if (!index)
			return;

		let value = sheets[index];

		if (!value)
			console.warn('Spritesheet not found');

		return value;
	}
	
	export var canvas;

	export function init() {
		canvas = document.createElement('canvas');

		document.body.appendChild(canvas);

		console.log('spritessheets init ');
	}

    const sheets: Readonly<List> = {
		badRoads: {
			file: 'sty/sheets/bad_roads.png',

			squares: {
				clear: { x: 1, y: 2 },
				middleTracks: { x: 2, y: 2 },
				middleCorner: { x: 3, y: 2 },
				sideClear: { x: 1, y: 1 },
				sideClear_alt: { x: 1, y: 1 },
				sideLine: { x: 4, y: 1 },
				sideDash: { x: 3, y: 1 },
				sideStop: { x: 2, y: 4 },
				sideStopLine: { x: 5, y: 1 },
				sideStopDash: { x: 5, y: 2 },
				single: { x: 1, y: 3 },
				singleExit: { x: 2, y: 3 },
				singleCorner: { x: 2, y: 3 },
				singleOpen: { x: 3, y: 5 },
				corner: { x: 4, y: 3 },
				convex: { x: 4, y: 5 },
				convexLine: { x: 5, y: 5 },
				sideDecal: { x: 1, y: 5 },
				sideDecal_2: { x: 2, y: 5 },
			},
			width: 320,
			height: 320,
			piece: { w: 64, h: 64 }
		},

		greenRoads: {
			file: 'sty/sheets/green_roads.png',

			squares: {
				clear: { x: 1, y: 2 },
				middleTracks: { x: 2, y: 2 },
				middleCorner: { x: 3, y: 2 },
				sideClear: { x: 1, y: 1 },
				sideClearAlt: { x: 1, y: 1 },
				sideLine: { x: 4, y: 1 },
				sideDash: { x: 3, y: 1 },
				sideStop: { x: 2, y: 4 },
				sideStopLine: { x: 5, y: 1 },
				sideStopDash: { x: 5, y: 2 },
				parkingSpot: { x: 1, y: 4 },
				customNotch: { x: 3, y: 4 },
				single: { x: 1, y: 3 },
				singleExit: { x: 2, y: 3 },
				singleCorner: { x: 2, y: 3 },
				singleOpen: { x: 3, y: 5 },
				corner: { x: 4, y: 3 },
				convex: { x: 4, y: 5 },
				convexLine: { x: 5, y: 5 },
				sideDecal: { x: 1, y: 5 },
				sideDecal_2: { x: 2, y: 5 },
			},
			width: 320,
			height: 320,
			piece: { w: 64, h: 64 }
		},

		mixedRoads: {
			file: 'sty/sheets/mixed_roads.png',

			squares: {
				clear: { x: 1, y: 2 },
				middleTracks: { x: 2, y: 2 },
				middleCorner: { x: 3, y: 2 },
				sideClear: { x: 1, y: 1 },
				sideClearAlt: { x: 1, y: 1 },
				sideLine: { x: 4, y: 1 },
				sideDash: { x: 3, y: 1 },
				sideStop: { x: 2, y: 4 },
				sideStopLine: { x: 5, y: 1 },
				sideStopDash: { x: 5, y: 2 },
				parkingSpot: { x: 1, y: 4 },
				customNotch: { x: 3, y: 4 },
				single: { x: 1, y: 3 },
				singleExit: { x: 2, y: 3 },
				singleCorner: { x: 2, y: 3 },
				singleOpen: { x: 3, y: 5 },
				corner: { x: 4, y: 3 },
				convex: { x: 4, y: 5 },
				convexLine: { x: 5, y: 5 },
				sideDecal: { x: 1, y: 5 },
				sideDecal_2: { x: 2, y: 5 },
			},
			width: 320,
			height: 320,
			piece: { w: 64, h: 64 }
		},

		greyRoads: {
			file: 'sty/sheets/grey_roads.png',

			squares: {
				clear: { x: 1, y: 2 },
				middleTracks: { x: 2, y: 2 },
				middleCorner: { x: 3, y: 2 },
				sideClear: { x: 1, y: 1 },
				sideClearAlt: { x: 1, y: 1 },
				sideLine: { x: 4, y: 1 },
				sideDash: { x: 3, y: 1 },
				sideStop: { x: 2, y: 4 },
				sideStopLine: { x: 5, y: 1 },
				sideStopDash: { x: 5, y: 2 },
				parkingSpot: { x: 1, y: 4 },
				customNotch: { x: 3, y: 4 },
				single: { x: 1, y: 3 },
				singleExit: { x: 2, y: 3 },
				singleCorner: { x: 2, y: 3 },
				singleOpen: { x: 3, y: 5 },
				corner: { x: 4, y: 3 },
				convex: { x: 4, y: 5 },
				convexLine: { x: 5, y: 5 },
				sideDecal: { x: 1, y: 5 },
				sideDecal_2: { x: 2, y: 5 },
			},
			width: 320,
			height: 320,
			piece: { w: 64, h: 64 }
		},

		yellowyPavement: {
			file: 'sty/sheets/yellowy_pavement.png',

			squares: {
				middle: { x: 1, y: 1 },
			},
			width: 256,
			height: 256,
			piece: { w: 64, h: 64 }
		},

		greenPavement: {
			file: 'sty/sheets/green_pavement.png',

			squares: {
				middle: { x: 1, y: 1 },
				sideShadowed: { x: 2, y: 1 },
				sidePaved: { x: 3, y: 1 },
				sidePavedShadowed: { x: 4, y: 1 },
				sidePavedShadowedVent: { x: 3, y: 3 },
				sideLineEnd: { x: 3, y: 1 },
			},
			width: 256,
			height: 256,
			piece: { w: 64, h: 64 }
		}
	}
    
}

export default Spritesheets;