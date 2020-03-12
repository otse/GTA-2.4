import Sheets from "./Sheets";
import Sheet from "./Sheet";

namespace Sprites {

	type ListXX = { [index: string]: Readonly<Sheet> }

	const sprites: ListXX = {};

	export function sprite(a: number, b: number): Square {
		return { x: a, y: b };
	}

	export const ROADS = {
		CLEAR: sprite(1, 2),
		MIDDLE_TRACKS: sprite(2, 2),
		MIDDLE_CORNER: sprite(3, 2),
		SIDE_CLEAR: sprite(1, 1),
		SIDE_CLEAR_ALT: sprite(1, 1),
		SIDE_LINE: sprite(4, 1),
		SIDE_DASH: sprite(3, 1),
		SIDE_STOP: sprite(2, 4),
		SIDE_STOP_LINE: sprite(5, 1),
		SIDE_STOP_DASH: sprite(5, 2),
		PARKING_SPOT: sprite(1, 4),
		CUSTOM_NOTCH: sprite(3, 4),
		SINGLE: sprite(1, 3),
		SINGLE_EXIT: sprite(2, 3),
		SINGLE_CORNER: sprite(3, 3),
		SINGLE_OPEN: sprite(3, 5),
		CORNER: sprite(4, 3),
		CONVEX: sprite(4, 5),
		CONVEX_LINE: sprite(5, 5),
		SIDE_DECAL: sprite(1, 5),
		SIDE_DECAL_2: sprite(2, 5)
	};

	export const PAVEMENTS = {
		MIDDLE: sprite(1, 1),
		SIDE_SHADOWED: sprite(2, 1),
		SIDE_PAVED: sprite(3, 1),
		SIDE_PAVED_SHADOWED: sprite(4, 1),
		SIDE_PAVED_SHADOWED_VENT: sprite(3, 3),
		SIDE_LINE_END: sprite(3, 1)
	}

	export function init() {

		console.log('sprites init');
		
	}
}

export default Sprites;