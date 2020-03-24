import Car from "./Car";
import KILL from "../KILL";
import Sheet from "../Sprites/Sheet";
import APhysic from "./Every line is a physic";

namespace Cars {

	/// names

	// const contexts
	export const Names2 = [
		"Romero", "Wellard", "Aniston BD4", "Pacifier",
		"G4 Bank Van", "Beamer", "Box Car", "Box Truck",
		"Bug", "Bulwark", "Bus", "Cop Car",
		"Minx", "Eddy", "Panto", "Fire Truck",
		"Shark", "GT-A1", "Garbage Truck", "Armed Land Roamer",
		"Hot Dog Van", "Ice-Cream Van", "Dementia Limousine", "Dementia",
		"Land Roamer", "Jefferson", "Stretch Limousine", "Sports Limousine",
		"Medicar", "Benson", "Schmidt", "Miara",
		"Big Bug", "Morton", "Maurice", "Pickup",
		"A-Type", "Arachnid", "Spritzer", "Stinger",
		"Meteor", "Meteor Turbo", "Hachura", "B-Type",
		"Taxi Xpress", "SWAT Van", "Michelli Roadster", "Tank",
		"Tanker", "Taxi", "T-Rex", "Tow Truck",
		"Train", "Train Cab", "Train FB", "Trance-Am",
		"Truck Cab", "Truck Cab SX", "Container", "Transporter",
		"TV Van", "Van", "U-Jerk Truck", "Z-Type",
		"Rumbler", /*"Wreck 0", "Wreck 1", "Wreck 2",
		"Wreck 3", "Wreck 4", "Wreck 5", "Wreck 6",
		"Wreck 7", "Wreck 8", "Wreck 9",*/ "Jagular XK",
		"Furore GT", "Special Agent Car", "Karma Bus"
	] as const

	export type Names = typeof Names2[number]

	/// sprays 

	export enum Sprays {
		BLUE1, PURPLE1, BLACK, BLUE2,
		BLUE_GRAY, BRIGHT_GREEN, BRIGHT_RED, BROWN1,
		BROWN2, SILVER_BLUE, CREAM, YELLOW,
		CYAN, DARK_BEIGE, DARK_BLUE, DEEP_BLUE,
		DARK_GREEN, DARK_RED, DARK_RUST, GOLD,
		GREEN, GRAY, YELLOW_GREEN, OLIVE,
		ORANGE, PALE_BLUE, PINK_RED, PURPLE2,
		RED, RUST, SILVER, SKY_BLUE,
		TURQUOISE, WHITE_GRAY, WHITE, COP
	}

	export function getSpray(id: number): string {
		return Sprays[name]
	}

	/// functions

	export function init() {
		cars = []

		make_sheets();
	}

	var cars: Car[]

	export function getCars(): ReadonlyArray<Car> {
		return cars
	}

	export function add(car: Car) {
		cars.push(car)
	}

	export function remove(car: Car) {
		cars.splice(cars.indexOf(car), 1)
	}

	// deltas (damage / doors / etc)

	export const deltasSheets: { [name: string]: Sheet } = {};

	export function make_sheets() {

		const list = APhysic.getROList();

		for (let name in list) {

			let physics = APhysic.get(name as any);

			const sheet: Sheet = {
				file: `sty/car/painted_deltas/D_GTA2_CAR_`,
				padding: 4,
				width: (physics.x_img_width * 10) + 9 * 4,
				height: (physics.x_img_height * 2) + 4,
				nr: {
					w: 10,
					h: 2
				},
				piece: {
					w: physics.x_img_width,
					h: physics.x_img_height
				}
			};

			deltasSheets[name] = sheet;
		}
	}

	export const deltaSquares = {
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

	/// script codes

	type ScriptName = string

	// mapped object type
	type Foo = {
		[K in Cars.Names]: ScriptName
	};

	export const scriptCodes: Foo =
	{
		'Aniston BD4': 'AMDB4',
		'Arachnid': 'SPIDER',
		'Armed Land Roamer': 'GUNJEEP',
		'A-Type': 'RTYPE',
		'Beamer': 'BMW',
		'Benson': 'MERC',
		'Box Truck': 'BOXTRUCK',
		'Big Bug': 'MONSTER',
		'B-Type': 'STYPE',
		'Bug': 'BUG',
		'Bus': 'BUS',
		'Bulwark': 'BUICK',
		'Box Car': 'BOXCAR',
		'Container': 'TRUKCONT',
		'Cop Car': 'COPCAR',
		'Dementia': 'ISETTA',
		'Dementia Limousine': 'ISETLIMO',
		'Eddy': 'EDSEL',
		'Fire Truck': 'FIRETRUK',
		'Furore GT': 'ZCX5',
		'G4 Bank Van': 'BANKVAN',
		'Garbage Truck': 'GTRUCK',
		'GT-A1': 'GT24640',
		'Hachura': 'STRIPETB',
		'Hot Dog Van': 'HOTDOG',
		'Ice-Cream Van': 'ICECREAM',
		'Jagular XK': 'XK120',
		'Jefferson': 'JEFFREY',
		'Karma Bus': 'KRSNABUS',
		'Land Roamer': 'JEEP',
		'Maurice': 'MORRIS',
		'Medicar': 'MEDICAR',
		'Meteor': 'STRATOS',
		'Meteor Turbo': 'STRATOSB',
		'Miara': 'MIURA',
		'Michelli Roadster': 'T2000GT',
		'Minx': 'DART',
		'Morton': 'MORGAN',
		'Pacifier': 'APC',
		'Panto': 'FIAT',
		'Pickup': 'PICKUP',
		'Romero': 'ALFA',
		'Rumbler': 'WBTWIN',
		'Schmidt': 'MESSER',
		'Shark': 'GRAHAM',
		'Special Agent Car': 'EDSELFBI',
		'Sports Limousine': 'LIMO2',
		'Spritzer': 'SPRITE',
		'Stinger': 'STINGRAY',
		'Stretch Limousine': 'LIMO',
		'SWAT Van': 'SWATVAN',
		'Tank': 'TANK',
		'Tanker': 'TANKER',
		'Taxi': 'TAXI',
		'Taxi Xpress': 'STYPECAB',
		'Tow Truck': 'TOWTRUCK',
		'Train': 'TRAIN',
		'Train Cab': 'TRAINCAB',
		'Train FB': 'TRAINFB',
		'Trance-Am': 'TRANCEAM',
		'Transporter': 'TRUKTRNS',
		'T-Rex': 'TBIRD',
		'Truck Cab': 'TRUKCAB1',
		'Truck Cab SX': 'TRUKCAB2',
		'TV Van': 'TVVAN',
		'U-Jerk Truck': 'VESPA',
		'Van': 'VAN',
		'Wellard': 'ALLARD',
		'Z-Type': 'VTYPE'
	};

	/// tests, useful for #highway

	export function checkDims() {

		for (let car of cars) {
			let mat = (car.material as any);
			if (!car.physics || !mat.map.image)
				continue;
			if (car.physics.x_img_width != mat.map.image.width ||
				car.physics.x_img_height != mat.map.image.height)
				console.warn(`warning for ${car.data.car}`);
		}
	}
}

(window as any).Cars = Cars;

export default Cars;