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

		let cat: Data2;
		let dog: Data2;
		let swerves = {};

		const ROADS = 2000;

		const load = function () {

			Generators.Roads.twolane(1, [10, -ROADS + 10, 0], ROADS, 'qualityRoads');

			cat = {
				type: 'Car',
				car: 'Michelli Roadster',
				spray: Cars.Sprays.DARK_BLUE,
				x: 10.5,
				y: -1,
				z: 0
			}

			Datas.deliver(cat);

			dog = {
				type: 'Car',
				car: 'Van',
				spray: Cars.Sprays.PINK_RED,
				x: 10.5,
				y: -101.1,
				z: 0
			}

			Datas.deliver(dog);

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
		let carSpeed = 0.14;
		let gaveLights = false;
		let brakeHard = false;
		let zoomCrash = false;
		let lookAhead = 50;

		const update = function () {
			let car = cat.object as Car;
			let van = dog.object as Car;

			if (stage == 0) {
				KILL.view = cat;

				cat.y -= carSpeed;

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
					let r = (Math.random() - 0.5) / 12;
					let p = Points.make(cat.x + r, cat.y - lookAhead);
					swerve = p;
					swerveAt = 10 + Math.random() * 15;
				}
				let theta = Math.atan2(cat.y - swerve.y, cat.x - swerve.x);

				let newr = theta - Math.PI / 2;
				cat.r = newr;

				cat.x += Math.cos(theta - Math.PI);

				//if (car && my_car.y < -10) {
				//	my_car.z += 2;
				//}
				if (!brakeHard && car && cat.y < -80) {
					brakeHard = true;

					lookAhead = 70;

					Cameraz.set2(150);

					Cameraz.ZOOMDUR = 3;
				}
				if (brakeHard) {
					carSpeed -= 0.01 * Four.delta;
				}

				if (car && cat.y < -100) {
					car.add_delta(Cars.deltaSquares.dent_front_left);
					car.add_delta(Cars.deltaSquares.dent_front_right);

					van.add_delta(Cars.deltaSquares.dent_behind_left);
					van.add_delta(Cars.deltaSquares.dent_behind_right);

					stage = 1;
				}

				let w = Points.real_space(cat);

				Four.camera.position.x = w.x;
				Four.camera.position.y = w.y;

			}
			else if (stage == 1) {
				let w = Points.real_space(cat);

				Four.camera.position.x = w.x;
				Four.camera.position.y = w.y;

				if (!zoomCrash) {

					//Cameraz.set2(200);

					//Cameraz.ZOOMDUR = 3;
					zoomCrash = true;
				}
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