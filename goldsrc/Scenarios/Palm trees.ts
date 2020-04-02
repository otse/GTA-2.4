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

		let dat: Data2;
		let swerves = {};

		const ROADS = 2000;

		const load = function () {

			Generators.Roads.twolane(1, [10, -ROADS + 10, 0], ROADS, 'qualityRoads');

			dat = {
				type: 'Car',
				car: 'Aniston BD4',
				spray: Cars.Sprays.DARK_GREEN,
				x: 10.5,
				y: -1,
				z: 0
			}

			Datas.deliver(dat);

			console.log('loaded palm trees');

			Generators.loop([10, -ROADS + 10, 0], [10, ROADS, 0], (w: [number, number, number]) => {
				let r = (Math.random() - 0.5) / 2;
				let p = Points.make(w[0], w[1]);
				let p2 = Points.make(w[0] + 0.5 + r, w[1] - 20);
				swerves[Points.string(p)] = p2;
			});
		};

		let stage = 0;
		let radians = -Math.PI / 2;

		let swerveAt = 0;
		let swerve;

		const update = function () {
			let car = dat.object as Car;

			if (stage == 0) {
				KILL.view = dat;

				dat.y -= 0.07;

				if (--swerveAt <= 0) {
					let s = Points.string(Points.floor(dat));
					swerve = swerves[s];
					swerveAt = 10;
				}
				let theta = Math.atan2(dat.y - swerve.y, dat.x - swerve.x);

				dat.r = theta - Math.PI / 2;

				let cos = Math.cos(theta - Math.PI);

				dat.x += 0.05 * cos;

				//if (car && my_car.y < -10) {
				//	my_car.z += 2;
				//}

				if (car && dat.y < -50) {
					car.add_delta(Cars.deltaSquares.dent_front_left);
					car.add_delta(Cars.deltaSquares.dent_front_right);
					stage = 1;
				}

				let w = Points.real_space(dat);

				Four.camera.position.x = w.x;
				Four.camera.position.y = w.y;
			}
			else if (stage == 1) {
				let w = Points.real_space(dat);

				Four.camera.position.x = w.x;
				Four.camera.position.y = w.y;
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