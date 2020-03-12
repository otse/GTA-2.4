import Data2 from "../Objects/Data";
import Datas from "../Objects/Datas";
import { Letterer } from "./Letterer";

export namespace Cinematics {

	export function init() {

        console.log('cinematics init');
        
	}

	export function update() {
        
	}

	export function missionText(words: string) {

		Letterer.makeNiceText(words);

	}

};

export default Cinematics;