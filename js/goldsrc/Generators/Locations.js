import Gens from "./Neat ones go in here";
import Gen2 from "./Messy ones";
export var GenLocations;
(function (GenLocations) {
    function aptsOffice() {
        // Note: Generate roads that merge last
        // This section is called Apts
        // Big roads on either side
        Gen2.GenPavements.vert(-1, -50, 0, 100, 1);
        Gen2.GenPavements.vert(3, -50, 0, 100, 1);
        Gen2.GenPavements.vert(12, -50, 0, 100, 1);
        Gen2.GenPavements.vert(9, -50, 0, 100, 1);
        Gens.GenRoads.highway(1, [0, -25, 0], 50, 3, 'badRoads');
        Gens.GenRoads.twolane(1, [10, -25, 0], 50, 'badRoads'); // vert
        Gens.GenFlats.type1([4, 7, 0], [6, 6, 1]); // Apts above
        Gens.GenFlats.type1([4, 0, 0], [4, 4, 1]); // Office
        Gen2.GenPavements.fill([4, 4, 0], 4, 1);
        // The roads around the office with parking
        Gens.GenRoads.twolane(0, [2, 5, 0], 9, 'mixedRoads'); // horz
        Gens.GenRoads.twolane(0, [2, -2, 0], 9, 'mixedRoads'); // horz
        //GenDeline.mixedToBad([2, 4, 0], 9, 4);
        //GenDeline.mixedToBad([2, -3, 0], 9, 4);
        Gens.GenParking.onewayRightVert([8, -1, 0], 7, 2, 'mixedRoads');
        Gen2.GenDeline.horz([7, 0, 0], 3, 4);
        // Deline around the apts
        Gen2.GenDeline.horz([2, 4, 0], 9, 4);
        Gen2.GenDeline.horz([2, -3, 0], 9, 4);
        //Pavements.Horz(3, -50, 0, 100, 1);
        //FillerBuildings.Type1([13, 5, 0], [5, 2, 2]);
        // Big parking lot with skyscraper
        Gens.GenFlats.type1([13, 6, 0], [8, 8, 1]);
        Gen2.GenPavements.vert(21, -50, 0, 100, 1);
        Gen2.GenPavements.fill([12, 0, 0], 10, 6);
        Gens.GenParking.leftBigHorz([11, 1, 0], 10, 3, 'greyRoads');
        Gen2.GenDeline.horz([11, 1, 0], 3, 4); // Dash It!
        Gens.GenRoads.twolane(1, [22, -25, 0], 50, 'badRoads');
        Gens.GenRoads.twolane(0, [11, -2, 0], 12, 'badRoads');
        Gen2.GenPavements.fill([12, -3, 0], 9, 1);
    }
    GenLocations.aptsOffice = aptsOffice;
    function longLonesome() {
        Gen2.GenPlaza.fill([-10, -500, 0], 1000, 1000, 'sty/nature/park original/216.bmp');
        //GenPlaza.fill([9, -100, 0], 1, 200);
        //GenPlaza.fill([13, -100, 0], 1, 200);
        Gens.GenRoads.highway(1, [10, -500, 0], 1000, 3, 'greenRoads');
        //GenRoads.twolane(1, [10, -25, 0], 50, 'badRoads'); // vert
    }
    GenLocations.longLonesome = longLonesome;
})(GenLocations || (GenLocations = {}));
export default GenLocations;
