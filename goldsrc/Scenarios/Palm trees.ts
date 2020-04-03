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
import Cameraz from "../Unsorted/Cameraz";

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
				car: 'Michelli Roadster',
				spray: Cars.Sprays.DARK_BLUE,
				x: 10.5,
				y: -1,
				z: 0
			}

			Datas.deliver(dat);

			Four.camera.position.z = 60;

			Cameraz.allowManual = true;
			Cameraz.set2(100);

			Cameraz.ZOOMDUR = 20;

			console.log('loaded palm trees');
		};

		let stage = 0;
		let radians = -Math.PI / 2;

		let swerveAt = 0;
		let swerve;
		let gaveLights = false;
		let secondZooming = false;

		const update = function () {
			let car = dat.object as Car;

			if (stage == 0) {
				KILL.view = dat;

				dat.y -= 0.07;

				if (car && !gaveLights) {
					gaveLights = true;
					let f;
					//car.add_delta(Cars.deltaSquares.tail_light_left);
					//f = car.add_delta(Cars.deltaSquares.tail_light_right);
					//f.mesh.scale.set(-1, 1, 1);
					car.add_delta(Cars.deltaSquares.head_light_left);
					f = car.add_delta(Cars.deltaSquares.head_light_right);
					f.mesh.scale.set(-1, 1, 1);
				}

				if (--swerveAt <= 0) {
					let r = (Math.random() - 0.5) / 10;
					let p = Points.make(dat.x + r, dat.y - 70);
					swerve = p;
					swerveAt = 15 + Math.random() * 15;
				}
				let theta = Math.atan2(dat.y - swerve.y, dat.x - swerve.x);

				let newr = theta - Math.PI / 2;
				dat.r = newr;

				dat.x += Math.cos(theta - Math.PI);

				//if (car && my_car.y < -10) {
				//	my_car.z += 2;
				//}

				if (car && dat.y < -100) {
					car.add_delta(Cars.deltaSquares.dent_front_left);
					car.add_delta(Cars.deltaSquares.dent_front_right);
					stage = 1;
				}

				let w = Points.real_space(dat);

				Four.camera.position.x = w.x;
				Four.camera.position.y = w.y;
				
				if (!secondZooming && car && dat.y < -30 && Four.camera.position.z < 300) {
					
					secondZooming = true;

					//Cameraz.set2(150);

					//Cameraz.ZOOMDUR = 10;
				}
				//}
				//else if (Four.camera.position.z < 60)
				//	Four.camera.position.z += 10 * Four.delta;

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