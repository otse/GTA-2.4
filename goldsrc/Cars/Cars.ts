import { parkedCarNames } from "./Script codes"

// PLURAL "LIKE A C API"
namespace Cars {
	export function GetRandomName() {

		let i = Math.floor(Math.random() * parkedCarNames.length);

		let name = parkedCarNames[i];
		
		console.log('GetRandomName ' + i + ' ' + name);

		return name;
	}
}

export default Cars;