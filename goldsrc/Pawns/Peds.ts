import Ped from "./Ped";

import Util from "../Random";

import { ShaderMaterial, MeshBasicMaterial } from "three";

import Anims from "../Sprites/Anims";
import Sheet from "../Sprites/Sheet";

//import { three } from "../three";

export namespace Peds {

    export function play(ped: Ped, word: string, square: Square | undefined = undefined) {

		const timer = ped.timers[word];

		Anims.update(timer);

		Util.UV.fromSheet(ped.geometry,
			square || timer.def.spriteArray![timer.i],
			Peds.sheet);

		return timer;
    }
    
    export var material: ShaderMaterial;
    export var materialShadow: MeshBasicMaterial;

    export const sheet: Sheet = {

        file: 'ped/template_24.png',
        width: 33 * 8,
        height: 33 * 23,
        piece: {
            w: 33,
            h: 33
        }
    };

}

export default Peds;