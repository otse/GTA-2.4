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

			Generators.Fill.fill([-500, -500, -3], [1000, 1000, 0], { sty: 'sty/special/water/1.bmp' }, { WHEEL: false });

			Generators.Roads.highway(1, [10, -7000, 0], 8000, 4, 'qualityRoads');

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
				if (j > 15) {
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
		let talkingHead: TalkingHead;
		let wordBox: WordBox;

		const update = function () {
			
			if (stage == 0) {
				talkingHead = new TalkingHead('guider');

				//wordBox = new WordBox("Out of the car. Move fast.\nNo room for stupidity today.");
				wordBox = new WordBox();
				wordBox.setText("No room for stupidity today.\n... ");
				//wordBox = new WordBox(`Nurse... It's time to "OPERATE"\non these commuters! `);
				//wordBox = new WordBox("ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890.,?!;~'\"`$()-");

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