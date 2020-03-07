import Gen1 from "./Generators1";
import Gen2 from "./Generators2";
import Sprites from "../Sprites/Sprites";

export namespace GenLocations {

	export function aptsOffice() {

		Gen1.roadMode = 'Adapt';

		// nature\tracks\514.bmp
		// nature/park original/216.bmp
		Gen2.GenPlaza.fill([-10, -500, 0], 1000, 1000, 'sty/nature/tracks/522.bmp');

		//Gen2.GenPavements.vert(-1, -50, 0, 100, 1);
		//Gen2.GenPavements.vert(3, -50, 0, 100, 1);
		
		//Gen2.GenPavements.vert(12, -50, 0, 100, 1);
		//Gen2.GenPavements.vert(9, -50, 0, 100, 1);

		//Gen1.GenRoads.highway(1, [0, -25, 0], 50, 3, 'badRoads');
		Gen1.GenRoads.twolane(1, [10, -25, 0], 50, 'greyRoads'); // Big main road

		//Gen1.GenFlats.type1([4, 7, 0], [6, 6, 1]); // Apts above
		Gen1.GenFlats.type1([2, 1, 0], [3, 4, 1]); // Gas station

		
		//Gen2.GenPavements.fill([4, 4, 0], 4, 1);
		
		// The roads around the office with parking
		Gen1.GenRoads.oneway(0, [6, 5, 0], 5, 'greyRoads'); // Parking exit
		Gen1.GenRoads.oneway(0, [6, 0, 0], 5, 'greyRoads'); // Parking exit

		Gen1.GenRoads.highway(1, [5, 0, 0], 6, 2, 'greyRoads'); // Pumps road
		
		//Gen1.GenRoads.twolane(0, [2, 5, 0], 9, 'greenRoads'); // horz
		//Gen1.GenRoads.twolane(0, [2, -2, 0], 9, 'greenRoads'); // horz
		
		//GenDeline.mixedToBad([2, 4, 0], 9, 4);
		//GenDeline.mixedToBad([2, -3, 0], 9, 4);
		
		Gen1.GenParking.onewayRight([8, 0, 0], 6, 2, 'badRoads');
		Gen2.GenDeline.horz([4, 0, 0], 6, 6);

		let gas_station_corner = Gen2.getDataOfType([8, 5, 0], 'Surface');
		let gas_station_corner2 = Gen2.getDataOfType([8, 0, 0], 'Surface');

		gas_station_corner!.sprite = Sprites.Roads.singleExit;
		gas_station_corner2!.sprite = Sprites.Roads.singleExit;
		//gas_station_corner2!.r! += 1;

		// Deline around the apts
		Gen2.GenDeline.horz([2, 4, 0], 9, 3);
		Gen2.GenDeline.horz([2, -1, 0], 9, 3);
		
		return;
		
		// I removed this because I wanted a lonely gas station


		//Pavements.Horz(3, -50, 0, 100, 1);
		//FillerBuildings.Type1([13, 5, 0], [5, 2, 2]);
		
		// Big parking lot with skyscraper
		Gen1.GenFlats.type1([13, 6, 0], [8, 8, 1]);
		Gen2.GenPavements.vert(21, -50, 0, 100, 1);
		Gen2.GenPavements.fill([12, 0, 0], 10, 6);
		Gen1.GenParking.leftBigHorz([11, 1, 0], 10, 3, 'greyRoads');
		Gen2.GenDeline.horz([11, 1, 0], 3, 4); // Dash It!

		Gen1.GenRoads.twolane(1, [22, -25, 0], 50, 'badRoads');

		Gen1.GenRoads.twolane(0, [11, -2, 0], 12, 'badRoads');
		Gen2.GenPavements.fill([12, -3, 0], 9, 1);

	}

	export function longLonesome() {

		Gen2.GenPlaza.fill([-10, -500, 0], 1000, 1000, 'sty/nature/park original/216.bmp');
		//GenPlaza.fill([9, -100, 0], 1, 200);
		//GenPlaza.fill([13, -100, 0], 1, 200);

		Gen1.GenRoads.highway(1, [10, -500, 0], 1000, 3, 'greenRoads');
		//GenRoads.twolane(1, [10, -25, 0], 50, 'badRoads'); // vert
	}

}

export default GenLocations;