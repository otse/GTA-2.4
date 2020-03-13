import { MeshPhongMaterial } from "three";
import Four from "../Four";
import Util from "../Random";
var Misting;
(function (Misting) {
    function init() {
        for (let i = 1; i <= 12; i++)
            waters.push(Util.loadTexture(`sty/special/water/${i}.bmp`));
        Misting.material = new MeshPhongMaterial({
            map: waters[0]
        });
    }
    Misting.init = init;
    function update() {
        time += Four.delta;
        if (time >= 0.11) {
            i += i < 11 ? 1 : -11;
            Misting.material.map = waters[i];
            time = 0;
        }
    }
    Misting.update = update;
})(Misting || (Misting = {}));
export default Misting;
