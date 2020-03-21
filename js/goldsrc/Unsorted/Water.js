import { MeshPhongMaterial } from "three";
import Four from "../Four";
import Util from "../Random";
var Water;
(function (Water) {
    let time;
    let j;
    let waters;
    function init() {
        time = 0;
        j = 0;
        waters = [];
        for (let i = 1; i <= 12; i++)
            waters.push(Util.loadTexture(`sty/special/water/${i}.bmp`));
        Water.material = new MeshPhongMaterial({
            map: waters[0]
        });
    }
    Water.init = init;
    function update() {
        time += Four.delta;
        if (time >= 0.11) {
            j += j < 11 ? 1 : -11;
            Water.material.map = waters[j];
            time = 0;
        }
    }
    Water.update = update;
})(Water || (Water = {}));
export default Water;
