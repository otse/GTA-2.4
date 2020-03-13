import Data2 from "../Objects/Data";
import Datas from "../Objects/Datas";
import Scenario from "./Scenario";

export namespace Scenarios {

	export var current: Scenario;

	export function load(p: Scenario) {
		current = p;

		current.load();
	}

	export function update() {
		if (current)
			current.update();
	}

};

export default Scenarios;