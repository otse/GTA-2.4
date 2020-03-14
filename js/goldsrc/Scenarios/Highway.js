import Generators from "../Generators/Generators";
import PaintJobs from "../Cars/Paints";
import Datas from "../Objects/Datas";
import { Scenarios } from "./Scenarios";
import { carNames } from "../Cars/Script codes";
import WordBox from "../Cinematics/Word box";
import TalkingHead from "../Cinematics/Talking head";
import KILL from "../KILL";
import Cars from "../Cars/Cars";
import Points from "../Objects/Points";
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
        let viewingCar;
        const update = function () {
            let currentCar = '';
            if (stage == 0) {
                talkingHead = new TalkingHead('johny_zoo');
                wordBox = new WordBox();
                wordBox.setText(`The highway has every car.\nI will tell you which.`, 1000);
                setTimeout(() => stage++, 5000);
                stage++;
            }
            else if (stage == 2) {
                let chunk = Datas.getChunk(KILL.ply.data);
                const carArray = Cars.getArray();
                let closest = 200;
                let closestCar = null;
                for (let car of carArray) {
                    let dist = Points.dist(car.data, KILL.ply.data);
                    if (dist < closest) {
                        closest = dist;
                        closestCar = car;
                    }
                }
                if (closestCar != viewingCar) {
                    viewingCar = closestCar;
                    let d = closestCar.data;
                    wordBox.setText(`${d.car},\n${PaintJobs.Enum[d.paint]} ${d.paint}`);
                }
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
