import Data2 from "../Objects/Data";

import Generators from "./Generators";
import Sprites from "../Sprites/Sprites";
import GenTools from "./Tools";
import Datas from "../Objects/Datas";
import Cars from "../Cars/Cars";
import { Shift } from "../Unsorted/Shift";

export namespace Levels {

	export function AptsOffice() {
		// Note: Generate roads that merge last
		Shift.set_intensity(0.5);

		// This section is called Apts
		// Big roads on either side
		Generators.Pavements.fill([-1, -50, 0], 100, 1);
		Generators.Pavements.fill([3, -50, 0], 100, 1);
		
		Generators.Pavements.fill([12, -50, 0], 100, 1);
		Generators.Pavements.fill([9, -50, 0], 100, 1);

		Generators.Roads.highway(1, [0, -25, 0], 50, 3, 'badRoads');
		Generators.Roads.twolane(1, [10, -25, 0], 50, 'badRoads'); // vert

		Generators.Buildings.type1([4, 7, 0], [6, 6, 3]); // Apts above
		Generators.Buildings.type1([4, 0, 0], [7, 4, 4]); // Office
		Generators.Pavements.fill([4, 4, 0], 4, 1);
		
		// The roads around the vert office
		Generators.Roads.twolane(0, [2, 5, 0], 9, 'mixedRoads'); // horz
		Generators.Roads.twolane(0, [2, -2, 0], 9, 'mixedRoads'); // horz
		
		//Deline.mixedToBad([2, 4, 0], 9, 4);
		//Deline.mixedToBad([2, -3, 0], 9, 4);
		
		Generators.Parking.onewayRight([8, -1, 0], 7, 2, 'mixedRoads');
		GenTools.Deline.horz([7, 0, 0], 3, 4, 0);

		// Deline around the apts
		GenTools.Deline.horz([2, 4, 0], 9, 4, 0);
		GenTools.Deline.horz([2, -3, 0], 9, 4, 0);

		//Pavements.Horz(3, -50, 0, 100, 1);
		//FillerBuildings.Type1([13, 5, 0], [5, 2, 2]);
		
		// Big parking lot with skyscraper
		Generators.Buildings.type1([13, 6, 0], [21, 14, 16]);

		//Generators.Pavements.vert(21, -50, 0, 100, 1);
		//Generators.Pavements.fill([12, 0, 0], 10, 6);
		Generators.Parking.leftBigHorz([11, 1, 0], 10, 3, 'greyRoads');
		GenTools.Deline.horz([11, 1, 0], 3, 4, 0); // Dash It!

		Generators.Roads.twolane(1, [22, -25, 0], 50, 'badRoads');

		Generators.Roads.twolane(0, [11, -2, 0], 12, 'badRoads');
		Generators.Pavements.fill([12, -3, 0], 9, 1);
	}

	export function gas_station() {

		Generators.roadMode = 'Adapt';

		// Fill the landscape
		// sty/nature/tracks/514.bmp
		// sty/nature/park original/216.bmp
		// sty/nature/evergreen/836.bmp - Turtoise wasteland

		//Generators.Fill.fill([-500, -500, 0], [1000, 1000, 0], { sty: 'sty/nature/evergreen/836.bmp' }, { WHEEL: true });

		//Generators.Fill.fill([10, -25, 0], [10+1000, -25+1000, 0], {sty: 'sty/nature/tracks/512.bmp'}, {RANDOM_ROTATION: true});

		//Generators.Fill.fill([12, -25, 0], 1, 50, {r: 3, sty: 'sty/nature/evergreen/839.bmp'});

		// Side of roads:
		// 'sty/nature/evergreen/839.bmp'
		//Generators.Fill.fill([9, -25, 0], [9, -25 + 50, 0], { r: 1, sty: 'sty/nature/evergreen/839.bmp' });
		//Generators.Fill.fill([9, -25, 0], [9, -25 + 50, 0], { r: 1, sty: 'sty/floors/mixed/64.bmp' });
		//Generators.Fill.fill([12, -25, 0], [12, -25 + 50, 0], { r: 3, sty: 'sty/nature/evergreen/839.bmp' });
		//Generators.Fill.fill([-25, 6, 0], [9, 6, 0], { r: 2, sty: 'sty/nature/evergreen/839.bmp' });
		//Generators.Fill.fill1([9, 6, 0], { r: 2, sty: 'sty/nature/evergreen/852.bmp' }); // 838
		//Generators.Fill.fill([-25, -1, 0], [9, -1, 0], { r: 0, sty: 'sty/nature/evergreen/839.bmp' });
		//Generators.Fill.fill1([9, -1, 0], { r: 1, sty: 'sty/nature/evergreen/852.bmp' }); // 838


		// Big main road:
		Generators.Roads.twolane(1, [10, -25, 0], 50, 'qualityRoads');

		//Generators.Fill.fill([12, -25, 0], 1, 50, {r: 2, sty: 'sty/nature/tracks/520.bmp'});
		Generators.Roads.oneway(0, [2, 5, 0], 9, 'qualityRoads'); // Parking entry
		Generators.Roads.oneway(0, [7, 0, 0], 4, 'qualityRoads'); // Parking exit

		// Deco in between road and parking
		Generators.Fill.fill([8, 1, 0], [9, 4, 0], { r: 0, sty: 'sty/floors/mixed/64.bmp' });
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
		GenTools.Deline.aabb([9, -1, 0], [13, 7, 0], 0); // Deline success

		//Generators.Fill.fill([6, 0, 0], [6, 4, 0], { r: 3, sty: 'sty/floors/yellow/933.bmp' }, { WHEEL: false });
		Generators.Fill.fill([6, 0, 0], [6, 4, 0], { r: 1, sty: 'sty/floors/mixed/64.bmp' }, { WHEEL: true });

		// Gas station
		Generators.Interiors.generate([3, 0, 0], [5, 4, 0], 'green');
		//Generators.Buildings.type1([3, 0, 0], [5, 4, 0]); // Gas station
		//Gen1.GenRoads.highway(1, [5, 0, 0], 6, 2, 'greyRoads'); // Pumps road

		//Gen1.GenRoads.twolane(0, [2, 5, 0], 9, 'greenRoads'); // horz
		//Gen1.GenRoads.twolane(0, [2, -2, 0], 9, 'greenRoads'); // horz

		//GenDeline.mixedToBad([2, 4, 0], 9, 4);
		//GenDeline.mixedToBad([2, -3, 0], 9, 4);

		Generators.Parking.onewayRight([7, 0, 0], 6, 2, 'qualityRoads');

		//GenTools.swap([7, 1, 0], [7, 4, 0], { sheet: 'badRoads' });
		//GenTools.swap([6, 2, 0], [6, 3, 0], { sheet: 'badRoads'} );

		//Gen2.GenDeline.horz([4, 0, 0], 6, 6);

		let gas_station_corner = GenTools.getDataOfType([7, 5, 0], 'Surface');
		let gas_station_corner2 = GenTools.getDataOfType([7, 0, 0], 'Surface');

		gas_station_corner!.sprite = Sprites.ROADS.SINGLE_EXIT;
		gas_station_corner2!.sprite = Sprites.ROADS.SINGLE_CORNER;
		gas_station_corner2!.r! += 1;


		return;

		// I removed this because I wanted a lonely gas station
		
		//Pavements.Horz(3, -50, 0, 100, 1);
		//FillerBuildings.Type1([13, 5, 0], [5, 2, 2]);

		// Big parking lot with skyscraper
		Generators.Buildings.type1([13, 6, 0], [8, 8, 1]);
		Generators.Pavements.vert(21, -50, 0, 100, 1);
		Generators.Pavements.fill([12, 0, 0], 10, 6);
		Generators.Parking.leftBigHorz([11, 1, 0], 10, 3, 'greyRoads');
		GenTools.Deline.horz([11, 1, 0], 3, 4, 0); // Dash It!

		Generators.Roads.twolane(1, [22, -25, 0], 50, 'badRoads');

		Generators.Roads.twolane(0, [11, -2, 0], 12, 'badRoads');
		Generators.Pavements.fill([12, -3, 0], 9, 1);

	}

	export function longLonesome() {

		Generators.Roads.twolane(1, [10, -7000, 0], 8000, 'qualityRoads');

		let car: Data2 = {
			type: 'Car',
			car: 'Minx',
			spray: Cars.Sprays.DARK_GREEN,
			x: 10.5,
			y: 0,
			z: 0
		}

		Datas.deliver(car);
	}

}

export default Levels;