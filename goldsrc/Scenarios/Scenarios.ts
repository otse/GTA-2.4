import Data2 from "../Objects/Data";
import Datas from "../Objects/Datas";
import Scenario from "./Scenario";

export namespace Scenarios {

	export var current: Scenario;

	export function load(p: Scenario) {
		current = p;

		current.loadCb();
	}

	export function update() {
		if (current)
			current.updateCb();
	}

};

export default Scenarios;