import Util from "../Random";
import Anims from "../Sprites/Anims";
//import { three } from "../three";
export var Peds;
(function (Peds) {
    function play(ped, word, square = undefined) {
        const timer = ped.timers[word];
        Anims.update(timer);
        Util.UV.fromSheet(ped.geometry, square || timer.def.spriteArray[timer.i], Peds.sheet);
        return timer;
    }
    Peds.play = play;
    Peds.sheet = {
        file: 'ped/template_24.png',
        width: 264,
        height: 759,
        piece: {
            w: 33,
            h: 33
        }
    };
})(Peds || (Peds = {}));
export default Peds;
