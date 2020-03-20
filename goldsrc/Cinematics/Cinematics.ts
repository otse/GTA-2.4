import Data2 from "../Objects/Data";
import Datas from "../Objects/Datas";
import { Fonts } from "./Fonts";

export namespace Cinematics {

	export function init() {

        console.log('cinematics init');
        
	}

	export function update() {
        
	}

	export function test_missionText(words: string) {

		Fonts.textTexture(words);

	}

};

export default Cinematics;