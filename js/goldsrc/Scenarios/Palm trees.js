import Generators from "../Generators/Generators";
import PaintJobs from "../Cars/Paints";
import Datas from "../Objects/Datas";
import { Scenarios } from "./Scenarios";
export var PalmTrees;
(function (PalmTrees) {
    function init() {
        console.log('Palm trees init');
        const load = function () {
            Generators.Roads.twolane(1, [10, -7000, 0], 8000, 'qualityRoads');
            let car = {
                type: 'Car',
                car: 'Minx',
                paint: PaintJobs.Enum.DARK_GREEN,
                x: 10.5,
                y: 0,
                z: 0
            };
            Datas.deliver(car);
            console.log('loaded palm trees');
        };
        const update = function () {
        };
        let palmTrees = {
            name: 'Palm Trees',
            load: load,
            update: update
        };
        Scenarios.load(palmTrees);
    }
    PalmTrees.init = init;
    ;
})(PalmTrees || (PalmTrees = {}));
export default PalmTrees;
