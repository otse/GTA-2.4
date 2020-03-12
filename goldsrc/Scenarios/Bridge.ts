import Scenario from "./Scenario";
import Generators from "../Generators/Generators";
import PaintJobs from "../Cars/Paints";
import Data2 from "../Objects/Data";
import Datas from "../Objects/Datas";
import { Scenarios } from "./Scenarios";
import { carNames } from "../Cars/Script codes";
import TalkingHead from "../Cinematics/Talking head";
import WordBox from "../Cinematics/Word box";

export namespace BridgeScenario {

	export function init() {
		console.log('Bridge scenario init');

		const load = function () {
			Generators.Roads.highway(1, [10, -7000, 0], 8000, 5, 'qualityRoads');

			let x = .5;
			let y = 0;
			let j = 0;
			for (let name of carNames) {

				let car: Data2 = {
					type: 'Car',
					car: name,
					//paint: PaintJobs.Enum.DARK_GREEN,
					x: 10 + x,
					y: y + 7,
					z: 0
				}

				y--;
				j++;
				if (j > 14) {
					j = 0;
					// Begin spawning at new lane
					y = 0;
					x += 1;
				}

				Datas.deliver(car);
			}

			console.log('loaded bridge scenario');
		};

		let stage = 0;
		let talkingHead;
		let wordBox;

		const update = function () {
			
			if (stage == 0) {
				talkingHead = new TalkingHead('jerkov');

				wordBox = new WordBox("Get out of the car");

				stage++;
			}

			talkingHead.update();
			wordBox.update();
		}

		let bridgeScenario: Scenario = {
			name: 'Bridge',
			load: load,
			update: update
		}

		Scenarios.load(bridgeScenario);
	};

}

export default BridgeScenario;