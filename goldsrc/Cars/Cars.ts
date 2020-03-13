import { parkedCarNames } from "./Script codes"

import Car from "./Car";

namespace Cars {
	var cars: Car[];

	export function init() {
		cars = [];
	}

	export function getArray(): ReadonlyArray<Car>{
		return cars;
	}

	export function add(car: Car) {
		cars.push(car);
	}

	export function remove(car: Car) {
		cars.splice(cars.indexOf(car), 1);
	}

	export function getPaint(car: Car): string {
		return '';
	}

	export function GetRandomName() {

		let i = Math.floor(Math.random() * parkedCarNames.length);

		let name = parkedCarNames[i];
		
		console.log('GetRandomName ' + i + ' ' + name);

		return name;
	}
}

export default Cars;