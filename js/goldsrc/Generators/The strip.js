import GenRoads from "./Roads";
import GenPavements from "./Pavements";
import GenFlats from "./Flats";
import GenDeline from "./Deline";
import GenParking from "./Parking";
export var GenStrip;
(function (GenStrip) {
    function aptsOffice() {
        // Note: Generate roads that merge last
        // This section is called Apts
        // Big roads on either side
        GenPavements.Vert(-1, -50, 0, 100, 1);
        GenPavements.Vert(3, -50, 0, 100, 1);
        GenPavements.Vert(12, -50, 0, 100, 1);
        GenPavements.Vert(9, -50, 0, 100, 1);
        GenRoads.highwayVert([0, -25, 0], 50, 3);
        GenRoads.twolane(1, [10, -25, 0], 50, 'badRoads'); // vert
        GenFlats.Type1([4, 7, 0], [6, 6, 1]); // Apts above
        GenFlats.Type1([4, 0, 0], [4, 4, 1]); // Office
        GenPavements.Fill([4, 4, 0], 4, 1);
        // The roads around the office with parking
        GenRoads.twolane(0, [2, 5, 0], 9, 'mixedRoads'); // horz
        GenRoads.twolane(0, [2, -2, 0], 9, 'mixedRoads'); // horz
        //GenDeline.mixedToBad([2, 4, 0], 9, 4);
        //GenDeline.mixedToBad([2, -3, 0], 9, 4);
        GenParking.OnewayRightVert([8, -1, 0], 7, 2, 'mixedRoads');
        GenDeline.horz([7, 0, 0], 3, 4);
        // Deline around the apts
        GenDeline.horz([2, 4, 0], 9, 4);
        GenDeline.horz([2, -3, 0], 9, 4);
        //Pavements.Horz(3, -50, 0, 100, 1);
        //FillerBuildings.Type1([13, 5, 0], [5, 2, 2]);
        // Big parking lot with skyscraper
        GenFlats.Type1([13, 6, 0], [8, 8, 1]);
        GenPavements.Vert(21, -50, 0, 100, 1);
        GenPavements.Fill([12, 0, 0], 10, 6);
        GenParking.LeftBigHorz([11, 1, 0], 10, 3, 'greyRoads');
        GenDeline.horz([11, 1, 0], 3, 4); // Dash It!
        GenRoads.twolaneVert([22, -25, 0], 50, 'badRoads');
        GenRoads.twolane(0, [11, -2, 0], 12, 'badRoads');
        GenPavements.Fill([12, -3, 0], 9, 1);
    }
    GenStrip.aptsOffice = aptsOffice;
})(GenStrip || (GenStrip = {}));
export default GenStrip;
