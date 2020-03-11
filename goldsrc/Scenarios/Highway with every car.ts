import Scenario from "./Scenario";
import Generators from "../Generators/Generators";
import PaintJobs from "../Cars/Paints";
import Data2 from "../Objects/Data";
import Datas from "../Objects/Datas";
import { Scenarios } from "./Scenarios";
import { carNames } from "../Cars/Script codes";

export namespace HighWayWithEveryCar {

    export function init() {
        console.log('Highway with every car init');

        const load = function () {
            Generators.Roads.highway(1, [10, -7000, 0], 8000, 5, 'qualityRoads');

            let x = .5;
            let y = 0;
            let j = 0;
            for (let name of carNames) {
                
                let car: Data2 = {
                    type: 'Car',
                    car: name,
                    //paint: PaintJobs.Enum.DARK_GREEN,
                    x: 10 + x,
                    y: y + 7,
                    z: 0
                }

                y --;
                j ++;
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
            
        }

        let highwayWithEveryCar: Scenario = {
            name: 'Highway with every car',
            load: load,
            update: update
        }

        Scenarios.load(highwayWithEveryCar);
    };

}

export default HighWayWithEveryCar;