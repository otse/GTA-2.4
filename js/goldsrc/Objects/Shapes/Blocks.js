import BoxCutter from "./Box cutter";
import { BoxBufferGeometry } from "three";
import Four from "../../Four";
import Util from "../../Random";
export var Blocks;
(function (Blocks) {
    function init() {
        Blocks.geometry = new BoxBufferGeometry(64, 64, 64);
        Util.UV.rotatePlane(Blocks.geometry, 0, 3);
        Util.UV.rotatePlane(Blocks.geometry, 1, 1);
        Util.UV.rotatePlane(Blocks.geometry, 2, 2);
    }
    Blocks.init = init;
    function getBits(data) {
        let str = '';
        for (let i = 0; i < 5; i++)
            str += data.faces[i] ? '|' : 'O';
        str = str.toString().replace(/[\s,]/g, '');
        return str;
    }
    function getBox(block) {
        let bits = getBits(block);
        let box = BoxCutter.geometries[bits];
        return box.clone();
    }
    Blocks.getBox = getBox;
    function show(block) {
        Four.scene.add(block.mesh);
    }
    Blocks.show = show;
    function hide(block) {
        Four.scene.remove(block.mesh);
    }
    Blocks.hide = hide;
})(Blocks || (Blocks = {}));
export default Blocks;
