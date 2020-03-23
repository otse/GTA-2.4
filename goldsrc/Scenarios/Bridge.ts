import Scenario from "./Scenario";
import Generators from "../Generators/Generators";
import Data2 from "../Objects/Data";
import Datas from "../Objects/Datas";
import { Scenarios } from "./Scenarios";
import TalkingHead from "../YM/Cutscene/Talking Heads";
import WordBox from "../YM/Cutscene/Word box";
import Widget from "../YM/Widget";

export namespace BridgeScenario {

	export function init() {
		console.log('Bridge scenario init');

		const load = function () {

			//Generators.Fill.fill([-500, -500, -3], [1000, 1000, 0], { sty: 'sty/special/water/1.bmp' }, { WHEEL: false });

			Generators.Roads.highway(1, [10, -7000, 0], 8000, 2, 'qualityRoads');

			let pickup: Data2 = {
				type: 'Car',
				car: 'Pickup',
				//paint: PaintJobs.Enum.BLUE2,
				x: 10.5,
				y: 3,
				z: 0
			};

			let morton: Data2 = {
				type: 'Car',
				car: 'Morton',
				//paint: PaintJobs.Enum.BRIGHT_RED,
				x: 10.5,
				y: 1.5,
				z: 0
			};

			let bank_van: Data2 = {
				type: 'Car',
				car: 'G4 Bank Van',
				x: 10.5,
				y: 0,
				z: 0
			};

			Datas.deliver(pickup);
			Datas.deliver(morton);
			Datas.deliver(bank_van);

			console.log('loaded bridge scenario');
		};

		let stage = 0;
		let talkingHead: TalkingHead;
		let wordBox: WordBox;
		let testElement: Widget;

		const update = function () {
			
			if (stage == 0) {
				talkingHead = new TalkingHead('guider');

				//wordBox = new WordBox("Out of the car. Move fast.\nNo room for stupidity today.");
				wordBox = new WordBox();
				wordBox.setText("No room for stupidity today.\n... ");
				//wordBox = new WordBox(`Nurse... It's time to "OPERATE"\non these commuters! `);
				//wordBox = new WordBox("ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890.,?!;~'\"`$()-");

				//testElement = new Widget({x: 0, y: 0, z: 0, w: window.innerWidth, h: window.innerHeight});

				stage++;
			}

			talkingHead.update();
			wordBox.update();
			//testElement.update();
		}

		let bridgeScenario: Scenario = {
			name: 'Bridge',
			loadCb: load,
			updateCb: update
		}

		Scenarios.load(bridgeScenario);
	};

}

export default BridgeScenario;