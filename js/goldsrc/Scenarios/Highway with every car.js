import Generators from "../Generators/Generators";
import Datas from "../Objects/Datas";
import { Scenarios } from "./Scenarios";
import { carNames } from "../Cars/Script codes";
export var HighWayWithEveryCar;
(function (HighWayWithEveryCar) {
    function init() {
        console.log('Highway with every car init');
        const load = function () {
            Generators.Roads.highway(1, [10, -7000, 0], 8000, 5, 'qualityRoads');
            let x = .5;
            let y = 0;
            let j = 0;
            for (let name of carNames) {
                let car = {
                    type: 'Car',
                    car: name,
                    //paint: PaintJobs.Enum.DARK_GREEN,
                    x: 10 + x,
                    y: y + 7,
                    z: 0
                };
                y--;
                j++;
                if (j > 14) {
                    j = 0;
                    y = 0;
                    // Move to next lane
                    x += 1;
                }
                Datas.deliver(car);
            }
            console.log('loaded highway with every car');
        };
        const update = function () {
        };
        let highwayWithEveryCar = {
            name: 'Highway with every car',
            load: load,
            update: update
        };
        Scenarios.load(highwayWithEveryCar);
    }
    HighWayWithEveryCar.init = init;
    ;
})(HighWayWithEveryCar || (HighWayWithEveryCar = {}));
export default HighWayWithEveryCar;
