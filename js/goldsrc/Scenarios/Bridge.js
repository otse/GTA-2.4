import Generators from "../Generators/Generators";
import Datas from "../Objects/Datas";
import { Scenarios } from "./Scenarios";
import { carNames } from "../Cars/Script codes";
import TalkingHead from "../Cinematics/Talking head";
export var BridgeScenario;
(function (BridgeScenario) {
    function init() {
        console.log('Bridge scenario init');
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
                    // Begin spawning at new lane
                    y = 0;
                    x += 1;
                }
                Datas.deliver(car);
            }
            console.log('loaded bridge scenario');
        };
        let stage = 0;
        let talkingHead;
        const update = function () {
            if (stage == 0) {
                talkingHead = new TalkingHead('jerkov');
                stage++;
            }
            talkingHead.update();
        };
        let bridgeScenario = {
            name: 'Bridge',
            load: load,
            update: update
        };
        Scenarios.load(bridgeScenario);
    }
    BridgeScenario.init = init;
    ;
})(BridgeScenario || (BridgeScenario = {}));
export default BridgeScenario;
