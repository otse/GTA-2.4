import { MeshPhongMaterial } from "three";
import Four from "../Four";
import Util from "../Random";
var Water;
(function (Water) {
    let time = 0;
    let i = 0;
    let waters = [];
    function init() {
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
            i += i < 11 ? 1 : -11;
            Water.material.map = waters[i];
            time = 0;
        }
    }
    Water.update = update;
})(Water || (Water = {}));
export default Water;
