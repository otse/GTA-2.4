import BoxCutter from "./Box cutter";
import { BoxBufferGeometry } from "three";
import Four from "../../Renderer";
import Util from "../../Random";
export var Blocks;
(function (Blocks) {
    function Init() {
        Blocks.geometry = new BoxBufferGeometry(64, 64, 64);
        Util.UV.RotatePlane(Blocks.geometry, 0, 3);
        Util.UV.RotatePlane(Blocks.geometry, 1, 1);
        Util.UV.RotatePlane(Blocks.geometry, 2, 2);
    }
    Blocks.Init = Init;
    function GetBits(data) {
        let str = '';
        for (let i = 0; i < 5; i++)
            str += data.faces[i] ? '|' : 'O';
        str = str.toString().replace(/[\s,]/g, '');
        return str;
    }
    function GetBox(block) {
        let bits = GetBits(block);
        let box = BoxCutter.geometries[bits];
        return box.clone();
    }
    Blocks.GetBox = GetBox;
    function show(block) {
        Four.scene.add(block.mesh);
    }
    Blocks.show = show;
    function Hide(block) {
        Four.scene.remove(block.mesh);
    }
    Blocks.Hide = Hide;
})(Blocks || (Blocks = {}));
export default Blocks;
