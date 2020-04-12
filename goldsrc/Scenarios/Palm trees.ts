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
import Sprites from "../Sprites/Sprites";
import GenTools from "../Generators/Tools";
import City from "../Chunks/City";
import { Shift } from "../Unsorted/Shift";

export namespace PalmTrees {

	function gas_station() {
		let offset_y = 0;
		// Fill the landscape
		// sty/nature/tracks/514.bmp
		// sty/nature/park original/216.bmp
		// sty/nature/evergreen/836.bmp - Turtoise wasteland

		Generators.Fill.fill([-500, -500, 0], [1000, 1000, 0], { sty: 'sty/nature/evergreen/836.bmp' }, { WHEEL: true });

		//Generators.Fill.fill([10, -25, 0], [10+1000, -25+1000, 0], {sty: 'sty/nature/tracks/512.bmp'}, {RANDOM_ROTATION: true});

		//Generators.Fill.fill([12, -25, 0], 1, 50, {r: 3, sty: 'sty/nature/evergreen/839.bmp'});

		// Side of roads:
		// 'sty/nature/evergreen/839.bmp'
		Generators.Fill.fill([8, -500, 0], [9, 1000, 0], { r: 1, sty: 'sty/nature/evergreen/839.bmp' });
		Generators.Fill.fill([9, -500, 0], [9, 1000, 0], { r: 1, sty: 'sty/floors/mixed/64.bmp' });
		Generators.Fill.fill([12, -500, 0], [12, 1000, 0], { r: 3, sty: 'sty/nature/evergreen/839.bmp' });
		Generators.Fill.fill([-25, 6, 0], [8, 6, 0], { r: 2, sty: 'sty/nature/evergreen/839.bmp' });
		Generators.Fill.fill1([8, 6, 0], { r: 2, sty: 'sty/nature/evergreen/852.bmp' }); // 838
		Generators.Fill.fill([-25, -1, 0], [8, -1, 0], { r: 0, sty: 'sty/nature/evergreen/839.bmp' });
		Generators.Fill.fill1([8, -1, 0], { r: 1, sty: 'sty/nature/evergreen/852.bmp' }); // 838


		// Big main road:
		Generators.Roads.twolane(1, [10, 0, 0], 100, 'greyRoads');
		//return;

		//Generators.Fill.fill([12, -25, 0], 1, 50, {r: 2, sty: 'sty/nature/tracks/520.bmp'});
		Generators.Roads.oneway(0, [2, 5, 0], 9, 'greyRoads'); // Parking entry
		Generators.Roads.oneway(0, [7, 0, 0], 4, 'greyRoads'); // Parking exit

		// Deco in between road and parking
		Generators.Fill.fill([8, 1 + offset_y, 0], [9, 4 + offset_y, 0], { r: 0, sty: 'sty/floors/mixed/64.bmp' });
		//Generators.Fill.fill([9, 1, 0], [9, 4, 0], { r: 1, sty: 'sty/nature/evergreen/836.bmp' });

		// Turq evergreen planter
		//Generators.Fill.fill1([9, 1, 0], { r: 2, sty: 'sty/nature/evergreen/840.bmp' });
		//Generators.Fill.fill1([9, 2, 0], { r: 2, sty: 'sty/nature/evergreen/859.bmp' });
		//Generators.Fill.fill1([9, 3, 0], { r: 2, sty: 'sty/nature/evergreen/859.bmp' });
		//Generators.Fill.fill1([9, 4, 0], { r: 0, sty: 'sty/nature/evergreen/840.bmp' });

		// Deline exits

		//GenTools.Deline.horz([2, 4, 0], 10, 3, 0);
		//GenTools.Deline.horz([2, -1, 0], 9, 3, 0);

		//GenTools.Deline.aabb([2, -1, 0], [2, 4+10, 0+9], 0);
		GenTools.Deline.aabb([9, -1 + offset_y, 0], [13, 7 + offset_y, 0], 0); // Deline success

		//Generators.Fill.fill([6, 0, 0], [6, 4, 0], { r: 3, sty: 'sty/floors/yellow/933.bmp' }, { WHEEL: false });
		Generators.Fill.fill([6, 0 + offset_y, 0], [6, 4 + offset_y, 0], { r: 1, sty: 'sty/floors/mixed/64.bmp' }, { WHEEL: true });

		// Gas station
		Generators.Interiors.generate([3, 0 + offset_y, 0], [5, 4 + offset_y, 0], 'green');
		//Generators.Buildings.type1([3, 0, 0], [5, 4, 0]); // Gas station
		//Gen1.GenRoads.highway(1, [5, 0, 0], 6, 2, 'greyRoads'); // Pumps road

		//Gen1.GenRoads.twolane(0, [2, 5, 0], 9, 'greenRoads'); // horz
		//Gen1.GenRoads.twolane(0, [2, -2, 0], 9, 'greenRoads'); // horz

		//GenDeline.mixedToBad([2, 4, 0], 9, 4);
		//GenDeline.mixedToBad([2, -3, 0], 9, 4);

		Generators.Parking.onewayRight([7, 0 + offset_y, 0], 6, 2, 'greyRoads');

		//GenTools.swap([7, 1, 0], [7, 4, 0], { sheet: 'badRoads' });
		//GenTools.swap([6, 2, 0], [6, 3, 0], { sheet: 'badRoads'} );

		//Gen2.GenDeline.horz([4, 0, 0], 6, 6);

		let gas_station_corner = GenTools.getDataOfType([7, 5 + offset_y, 0], 'Surface');
		let gas_station_corner2 = GenTools.getDataOfType([7, 0 + offset_y, 0], 'Surface');

		gas_station_corner!.sprite = Sprites.ROADS.SINGLE_EXIT;
		gas_station_corner2!.sprite = Sprites.ROADS.SINGLE_CORNER;
		gas_station_corner2!.r! += 1;
	}

	export function init() {
		console.log('Palm trees init');

		let ply: Data2;
		let cat: Data2;
		let dog: Data2;
		let swerves = {};

		const ROADS = 2000;

		const load = function () {

			//Generators.Fill.fill([-500, -500, -3], [1000, 1000, 0], { sty: 'sty/special/water/1.bmp' }, { WHEEL: false });

			//Generators.Roads.twolane(1, [10, -ROADS + 10, 0], ROADS, 'greyRoads');

			gas_station();

			let randomCar = Cars.Names2[KILL.floor_random(Cars.Names2.length)];

			cat = {
				type: 'Car',
				car: 'Hachura',
				spray: KILL.floor_random(Cars.Sprays.YELLOW_GREEN),
				x: 10.5,
				y: 97,
				z: 0
			}

			Datas.deliver(cat);

			dog = {
				type: 'Car',
				car: 'Van',
				spray: Cars.Sprays.PINK_RED,
				x: 10.5,
				y: 3,
				z: 0
			}

			Datas.deliver(dog);

			Four.camera.position.z = 40;

			Cameraz.allowManual = false;
			Cameraz.set2(150);

			Cameraz.ZOOMDUR = 15;

			console.log('loaded palm trees');
		};

		let stage = 0;
		let radians = -Math.PI / 2;

		let swerveAt = 0;
		let swerve;
		let carSpeed = 0.15;
		let gaveLights = false;
		let brakeHard = false;
		let zoomCrash = false;
		let lookAhead = 50;

		let setThingsUp = true;
		let talkingHead: TalkingHead;
		let wordBox: WordBox;

		const update = function () {
			let car = cat.object as Car;
			let van = dog.object as Car;

			if (stage == 0) {
				KILL.view = cat;
				KILL.city.shift(cat);

				cat.y -= carSpeed;

				if (setThingsUp) {
					Shift.set_intensity(.5);

					talkingHead = new TalkingHead('guider');
					talkingHead.speak_after(2500);
					talkingHead.quiet_after(8000);

					wordBox = new WordBox();
					//wordBox.setText(`Blah blah\nblah`, 1000);
					wordBox.setText(`What is the speed limit?`, 3000);

					setThingsUp = false;
				}

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
				if (!brakeHard && car && cat.y < dog.y + 26.5) {
					brakeHard = true;

					Shift.set_intensity(1);

					City.spanUneven = 5;
					wordBox.setText("Oh no!\n...", 0)

					talkingHead.should_blink(false);
					talkingHead.set_speed(0.13);
					talkingHead.set_limit(4);
					talkingHead.speak_after(0);
					talkingHead.disappear_after(2500);
					talkingHead.set_shock_after(1200);

					//talkingHead.widget.toggle();

					lookAhead = 70;

					Cameraz.set2(600);

					Cameraz.ZOOMDUR = 2.5;
				}
				if (brakeHard) {
					carSpeed -= 0.01 * Four.delta;
				}

				if (brakeHard && Cameraz.ZOOMDUR == 2.5 && car && cat.y < dog.y + 8) {
					console.log('zoom back in');
					
					Cameraz.ZOOMDUR = 1.7;

					Cameraz.set2(100);
				}

				if (car && cat.y < dog.y + 1) {
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

				if (KILL.view == cat) {
					Four.camera.position.x = w.x;
					Four.camera.position.y = w.y;
				}

				if (!zoomCrash) {

					Four.camera.position.y = 100;

					Cameraz.ZOOMDUR = 10;

					Cameraz.set2(300);

					Shift.set_intensity(2);

					ply = {
						type: 'Ply',
						//remap: 16,
						x: cat.x + .3,
						y: cat.y,
						z: 0
					};
					KILL.view = ply;

					Datas.deliver(ply);

					//Cameraz.set2(200);

					//Cameraz.ZOOMDUR = 3;
					zoomCrash = true;
				}
			}

			if (talkingHead)
				talkingHead.update();

			if (wordBox)
				wordBox.update();
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