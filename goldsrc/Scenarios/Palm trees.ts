import Scenario from "./Scenario";
import Generators from "../Generators/Generators";
import Data2 from "../Objects/Data";
import Datas from "../Objects/Datas";
import { Scenarios } from "./Scenarios";
import Cars from "../Cars/Cars";

export namespace PalmTrees {

    export function init() {
        console.log('Palm trees init');

        const load = function () {
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

            console.log('loaded palm trees');
            
        };

        const update = function () {
            
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