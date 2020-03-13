import Generators from "../Generators/Generators";
import Datas from "../Objects/Datas";
import { Scenarios } from "./Scenarios";
import { carNames } from "../Cars/Script codes";
import WordBox from "../Cinematics/Word box";
import TalkingHead from "../Cinematics/Talking head";
export var HighWayWithEveryCar;
(function (HighWayWithEveryCar) {
    function init() {
        console.log('Highway with every car init');
        const load = function () {
            Generators.Fill.fill([-500, -500, -3], [1000, 1000, 0], { sty: 'sty/special/water/1.bmp' }, { WHEEL: false });
            Generators.Roads.highway(1, [10, -7000, 0], 8000, 4, 'qualityRoads');
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
                if (j > 15) {
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
        let wordBox;
        const update = function () {
            if (stage == 0) {
                talkingHead = new TalkingHead('johny_zoo');
                wordBox = new WordBox("This highway has every car\nin a random color...");
                setTimeout(() => {
                    //talkingHead.talk(false);
                    wordBox.setText("Walk near a vehicle, and I'll\ntell you more about it.");
                    setTimeout(() => {
                        wordBox.setText("");
                        talkingHead.talk(false);
                    }, 6000);
                }, 6000);
                stage++;
            }
            else if (stage == 1) {
                stage++;
            }
            talkingHead.update();
            wordBox.update();
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
