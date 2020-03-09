import Generators from "./Generators";
import Sprites from "../Sprites/Sprites";
import GenTools from "./Tools";

export namespace GenLocations {

	export function aptsOffice() {

		Generators.roadMode = 'Adapt';

		// nature\tracks\514.bmp
		// nature/park original/216.bmp
		//Gen2.GenPlaza.fill([-10, -500, 0], 1000, 1000, 'sty/nature/tracks/522.bmp');

		Generators.Fill.fill([-500, -500, 0], 1000, 1000, {sty: 'sty/nature/evergreen/836.bmp'}, {RANDOM_ROTATION: true});

		Generators.Fill.fill([9, -25, 0], 1, 50, {r: 1, sty: 'sty/nature/evergreen/839.bmp'});
		Generators.Fill.fill([12, -25, 0], 1, 50, {r: 3, sty: 'sty/nature/evergreen/839.bmp'});
		Generators.Roads.twolane(1, [10, -25, 0], 50, 'greyRoads'); // Big main road

		//Gen1.GenFlats.type1([4, 7, 0], [6, 6, 1]); // Apts above
		
		
		//Gen2.GenPavements.fill([4, 4, 0], 4, 1);
		
		// The roads around the office with parking
		//Generators.Fill.fill([12, -25, 0], 1, 50, {r: 2, sty: 'sty/nature/tracks/520.bmp'});
		Generators.Roads.oneway(0, [3, 5, 0], 8, 'greyRoadsMixed'); // Parking entry
		Generators.Roads.oneway(0, [8, 0, 0], 3, 'greyRoadsMixed'); // Parking exit
		
		// Deline exits
		
		//GenTools.Deline.horz([2, 4, 0], 10, 3, 0);
		//GenTools.Deline.horz([2, -1, 0], 9, 3, 0);

		//GenTools.Deline.aabb([2, -1, 0], [2, 4+10, 0+9], 0);
		GenTools.Deline.aabb([9, -1, 0], [13, 7, 0], 0); // Deline success


		//Generators.Fill.fill([4, 4, 0], 4, 1, {r: 0, sty: 'sty/floors/mixed/64.bmp'}, {RANDOM_ROTATION: true});
		//Generators.Fill.fill([7, 0, 0], 1, 4, {r: 1, sty: 'sty/floors/mixed/64.bmp'}, {RANDOM_ROTATION: true});
		Generators.Buildings.type1([5, 0, 0], [3, 5, 1]); // Gas station
		//Gen1.GenRoads.highway(1, [5, 0, 0], 6, 2, 'greyRoads'); // Pumps road
		
		//Gen1.GenRoads.twolane(0, [2, 5, 0], 9, 'greenRoads'); // horz
		//Gen1.GenRoads.twolane(0, [2, -2, 0], 9, 'greenRoads'); // horz
		
		//GenDeline.mixedToBad([2, 4, 0], 9, 4);
		//GenDeline.mixedToBad([2, -3, 0], 9, 4);
		
		Generators.Parking.onewayRight([8, 0, 0], 6, 2, 'badRoads');
		//Gen2.GenDeline.horz([4, 0, 0], 6, 6);

		let gas_station_corner = GenTools.getDataOfType([8, 5, 0], 'Surface');
		let gas_station_corner2 = GenTools.getDataOfType([8, 0, 0], 'Surface');

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

		Generators.Fill.fill([-10, -500, 0], 1000, 1000, {sty: 'sty/nature/park original/216.bmp'});
		//GenPlaza.fill([9, -100, 0], 1, 200);
		//GenPlaza.fill([13, -100, 0], 1, 200);

		Generators.Roads.highway(1, [10, -500, 0], 1000, 3, 'greenRoads');
		//GenRoads.twolane(1, [10, -25, 0], 50, 'badRoads'); // vert
	}

}

export default GenLocations;