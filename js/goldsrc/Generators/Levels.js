import Generators from "./Generators";
import Sprites from "../Sprites/Sprites";
import GenTools from "./Tools";
export var GenLocations;
(function (GenLocations) {
    function aptsOffice() {
        Generators.roadMode = 'Adapt';
        // Fill the landscape
        // sty/nature/tracks/514.bmp
        // sty/nature/park original/216.bmp
        // sty/nature/evergreen/836.bmp - Turtoise wasteland
        Generators.Fill.fill([-500, -500, 0], [1000, 1000, 0], { sty: 'sty/nature/evergreen/836.bmp' }, { WHEEL: true });
        //Generators.Fill.fill([10, -25, 0], [10+1000, -25+1000, 0], {sty: 'sty/nature/tracks/512.bmp'}, {RANDOM_ROTATION: true});
        //Generators.Fill.fill([12, -25, 0], 1, 50, {r: 3, sty: 'sty/nature/evergreen/839.bmp'});
        // Side of roads:
        // 'sty/nature/evergreen/839.bmp'
        //Generators.Fill.fill([8, -25, 0], [8, -25 + 50, 0], { r: 1, sty: 'sty/nature/evergreen/839.bmp' });
        //Generators.Fill.fill([9, -25, 0], [9, -25 + 50, 0], { r: 1, sty: 'sty/floors/mixed/64.bmp' });
        //Generators.Fill.fill([12, -25, 0], [12, -25 + 50, 0], { r: 3, sty: 'sty/nature/evergreen/839.bmp' });
        //Generators.Fill.fill([-25, 6, 0], [9, 6, 0], { r: 2, sty: 'sty/nature/evergreen/839.bmp' });
        //Generators.Fill.fill1([9, 6, 0], { r: 2, sty: 'sty/nature/evergreen/852.bmp' }); // 838
        //Generators.Fill.fill([-25, -1, 0], [9, -1, 0], { r: 0, sty: 'sty/nature/evergreen/839.bmp' });
        //Generators.Fill.fill1([9, -1, 0], { r: 1, sty: 'sty/nature/evergreen/852.bmp' }); // 838
        // Big main road:
        Generators.Roads.twolane(1, [10, -25, 0], 50, 'greyRoads');
        //Generators.Fill.fill([12, -25, 0], 1, 50, {r: 2, sty: 'sty/nature/tracks/520.bmp'});
        Generators.Roads.oneway(0, [2, 5, 0], 9, 'greyRoads'); // Parking entry
        Generators.Roads.oneway(0, [7, 0, 0], 4, 'greyRoads'); // Parking exit
        // Deco in between road and parking
        Generators.Fill.fill([8, 1, 0], [9, 4, 0], { r: 0, sty: 'sty/floors/mixed/64.bmp' });
        //Generators.Fill.fill([9, 1, 0], [9, 4, 0], { r: 1, sty: 'sty/nature/evergreen/836.bmp' });
        Generators.Fill.fill1([9, 1, 0], { r: 2, sty: 'sty/nature/evergreen/840.bmp' });
        Generators.Fill.fill1([9, 2, 0], { r: 2, sty: 'sty/nature/evergreen/859.bmp' });
        Generators.Fill.fill1([9, 3, 0], { r: 2, sty: 'sty/nature/evergreen/859.bmp' });
        Generators.Fill.fill1([9, 4, 0], { r: 0, sty: 'sty/nature/evergreen/840.bmp' });
        // Deline exits
        //GenTools.Deline.horz([2, 4, 0], 10, 3, 0);
        //GenTools.Deline.horz([2, -1, 0], 9, 3, 0);
        //GenTools.Deline.aabb([2, -1, 0], [2, 4+10, 0+9], 0);
        GenTools.Deline.aabb([9, -1, 0], [13, 7, 0], 0); // Deline success
        Generators.Fill.fill([6, 0, 0], [6, 4, 0], { r: 0, sty: 'sty/floors/yellow/932.bmp' }, { WHEEL: true });
        Generators.Fill.fill([7, 0, 0], [7, 0, 0], { r: 1, sty: 'sty/floors/mixed/64.bmp' }, { WHEEL: true });
        //Generators.Buildings.type1([4, 0, 0], [5, 4, 0]); // Gas station
        Generators.Interiors.generate([4, 0, 0], [5, 4, 0]); // Gas station
        //Gen1.GenRoads.highway(1, [5, 0, 0], 6, 2, 'greyRoads'); // Pumps road
        //Gen1.GenRoads.twolane(0, [2, 5, 0], 9, 'greenRoads'); // horz
        //Gen1.GenRoads.twolane(0, [2, -2, 0], 9, 'greenRoads'); // horz
        //GenDeline.mixedToBad([2, 4, 0], 9, 4);
        //GenDeline.mixedToBad([2, -3, 0], 9, 4);
        Generators.Parking.onewayRight([7, 0, 0], 6, 2, 'greyRoads');
        //GenTools.swap([7, 1, 0], [7, 4, 0], { sheet: 'badRoads' });
        //GenTools.swap([6, 2, 0], [6, 3, 0], { sheet: 'badRoads'} );
        //Gen2.GenDeline.horz([4, 0, 0], 6, 6);
        let gas_station_corner = GenTools.getDataOfType([7, 5, 0], 'Surface');
        let gas_station_corner2 = GenTools.getDataOfType([7, 0, 0], 'Surface');
        gas_station_corner.sprite = Sprites.ROADS.SINGLE_EXIT;
        gas_station_corner2.sprite = Sprites.ROADS.SINGLE_CORNER;
        gas_station_corner2.r += 1;
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
    GenLocations.aptsOffice = aptsOffice;
    function longLonesome() {
        Generators.Fill.fill([-10, -500, 0], [-10, -500, 0], { sty: 'sty/nature/park original/216.bmp' });
        //GenPlaza.fill([9, -100, 0], 1, 200);
        //GenPlaza.fill([13, -100, 0], 1, 200);
        Generators.Roads.highway(1, [10, -500, 0], 1000, 3, 'greenRoads');
        //GenRoads.twolane(1, [10, -25, 0], 50, 'badRoads'); // vert
    }
    GenLocations.longLonesome = longLonesome;
})(GenLocations || (GenLocations = {}));
export default GenLocations;
