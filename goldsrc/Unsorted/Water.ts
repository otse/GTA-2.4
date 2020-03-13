import { Texture, MeshPhongMaterial } from "three";
import Four from "../Four";
import Util from "../Random";

namespace Water {
    let time = 0;
    let i = 0;
    let waters: Texture[] = []

    export var material: MeshPhongMaterial

    export function init() {
        for (let i = 1; i <= 12; i++)
            waters.push(Util.loadTexture(`sty/special/water/${i}.bmp`));

        material = new MeshPhongMaterial({
            map: waters[0]
        });
    }

    export function update() {
        time += Four.delta;

        if (time >= 0.11) {
            i += i < 11 ? 1 : -11;
            material.map = waters[i];
            time = 0;
        }
    }

}

export default Water;