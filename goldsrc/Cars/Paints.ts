import Sheet from "../Sprites/Sheet";
import EveryLineIsAPhysic from "./Every line is a physic";
import CarMetas from "./Metas";

// Automobiles, trains

// Resources
// https://gta.fandom.com/wiki/Vehicles_in_GTA_2
// http://en.wikigta.org/wiki/Code_lists_%28GTA2%29

namespace PaintJobs {

	export enum Enum {
		BLUE1,
		PURPLE1,
		BLACK,
		BLUE2,
		BLUE_GRAY,
		BRIGHT_GREEN,
		BRIGHT_RED,
		BROWN1,
		BROWN2,
		SILVER_BLUE,
		CREAM,
		YELLOW,
		CYAN,
		DARK_BEIGE,
		DARK_BLUE,
		DEEP_BLUE,
		DARK_GREEN,
		DARK_RED,
		DARK_RUST,
		GOLD,
		GREEN,
		GRAY,
		YELLOW_GREEN,
		OLIVE,
		ORANGE,
		PALE_BLUE,
		PINK_RED,
		PURPLE2,
		RED,
		RUST,
		SILVER,
		SKY_BLUE,
		TURQUOISE,
		WHITE_GRAY,
		WHITE,
		COP
	}

	export const deltasSheets: { [name: string]: Sheet } = {};

	export function init() {

		const list = EveryLineIsAPhysic.getList();

		for (let name in list) {

			const physic = list[name];

			const meta = CarMetas.getNullable(name);

			const sheet: Sheet = {
				file: `D_GTA2_CAR_${physic.model}`,
				padding: 4,
				width: (meta!.IMG_WIDTH * 10) + 36, // (9 * 4)
				height: (meta!.IMG_HEIGHT * 2) + 4,
				nr: {
					w: 10,
					h: 2
				},
				piece: {
					w: meta!.IMG_WIDTH,
					h: meta!.IMG_HEIGHT
				}
			};

			deltasSheets[name] = sheet;
		}

		console.log('build car delta sheets');

		(window as any).carsDeltas = deltasSheets;
	}

	const squares = {
		dent_behind_left: { x: 1, y: 1 },
		dent_behind_right: { x: 2, y: 1 },
		dent_front_right: { x: 3, y: 1 },
		dent_front_left: { x: 4, y: 1 },

		dent_in_the_roof_here: { x: 5, y: 1 },

		tail_light_right: { x: 6, y: 1 },
		tail_light_left: { x: 6, y: 1 },
		head_light_right: { x: 7, y: 1 },
		head_light_left: { x: 7, y: 1 },

		front_door1: { x: 8, y: 1 },
		front_door2: { x: 9, y: 1 },
		front_door3: { x: 10, y: 1 },
		front_door4: { x: 1, y: 2 },

		rear_door1: { x: 2, y: 2 },
		rear_door2: { x: 3, y: 2 },
		rear_door3: { x: 4, y: 2 },
		rear_door4: { x: 5, y: 2 },

		tv_van_dish: { x: 6, y: 2 }
	};
}

export default PaintJobs;