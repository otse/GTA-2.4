import Scenario from "./Scenario";
import Generators from "../Generators/Generators";
import Data2 from "../Objects/Data";
import Datas from "../Objects/Datas";
import { Scenarios } from "./Scenarios";
import TalkingHead from "../YM/Cutscene/Talking Heads";
import WordBox from "../YM/Cutscene/Word box";
import Widget from "../YM/Widget";
import Cars from "../Cars/Cars";
import Car from "../Cars/Car";
import Four from "../Four";
import Points from "../Objects/Points";
import KILL from "../KILL";

export namespace PalmTrees {

	export function init() {
		console.log('Palm trees init');

		let my_car: Data2;
		
		const load = function () {
			Generators.Roads.twolane(1, [10, -1000, 0], 2000, 'qualityRoads');

			my_car = {
				type: 'Car',
				car: 'Aniston BD4',
				spray: Cars.Sprays.DARK_GREEN,
				x: 10.5,
				y: -1,
				z: 0
			}

			Datas.deliver(my_car);

			console.log('loaded palm trees');
			
		};

		let stage = 0;

		const update = function () {
			if (stage == 0) {
				KILL.view = my_car;

				my_car.y -= 0.02;

				let w = Points.real_space(my_car);

				Four.camera.position.x = w.x;
				Four.camera.position.y = w.y;
			}
			else if (stage == 1) {

			}
		}

		let palmTrees: Scenario = {
			name: 'Palm Trees',
			loadCb: load,
			updateCb: update
		}

		Scenarios.load(palmTrees);
	};

}

export default PalmTrees;