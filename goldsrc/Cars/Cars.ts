import { parkedCarNames } from "./Script codes"

import Car from "./Car";
import KILL from "../KILL";

namespace Cars {

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

	var cars: Car[]

	export function init() {
		cars = []
	}

	export function getArray(): ReadonlyArray<Car> {
		return cars
	}

	export function add(car: Car) {
		cars.push(car)
	}

	export function remove(car: Car) {
		cars.splice(cars.indexOf(car), 1)
	}

	export function getPaint(car: Car): string {
		return ''
	}

	export function getRandomName() {
		let i = KILL.floorrandom(parkedCarNames.length);

		let name = parkedCarNames[i];

		return name;
	}

	// things to try on the #highway:

	export function checkDims() {

		for (let car of cars) {
			let mat = (car.material as any);
			if (!car.physics || !mat.map.image)
				continue;
			if (car.physics.meta.img_width != mat.map.image.width ||
				car.physics.meta.img_height != mat.map.image.height)
				console.warn(`warning for ${car.data.car}`);
		}
	}
}

(window as any).Cars = Cars;

export default Cars;