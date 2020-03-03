import Util from "../Random";
import Anims from "../Sprites/Anims";
//import { three } from "../three";
export var Peds;
(function (Peds) {
    function play(ped, word, square = undefined) {
        const timer = ped.timers[word];
        Anims.update(timer);
        Util.UV.fromSheet(ped.geometry, square || timer.def.tiles[timer.i], Peds.sheet);
        return timer;
    }
    Peds.play = play;
    Peds.sheet = {
        file: 'ped/template_24.png',
        width: 33 * 8,
        height: 33 * 23,
        squares: {
            lol: { x: 0, y: 0 }
        },
        piece: {
            w: 33,
            h: 33
        }
    };
})(Peds || (Peds = {}));
export default Peds;
