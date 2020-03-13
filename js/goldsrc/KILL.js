import City from "./Chunks/City";
import Ply from "./Pawns/Ply";
import Phong2 from "./Shaders/Phong2";
import Rectangles from "./Objects/Rectangles";
import Surfaces from "./Objects/Shapes/Surfaces";
import Blocks from "./Objects/Shapes/Blocks";
import BoxCutter from "./Objects/Shapes/Box cutter";
import Sprites from "./Sprites/Sprites";
import Sheets from "./Sprites/Sheets";
import Zoom from "./Unsorted/Zoom";
import { Movie } from "./Unsorted/RGB Shift";
import { Cinematics } from "./Cinematics/Cinematics";
import BridgeScenario from "./Scenarios/Bridge";
import { Scenarios } from "./Scenarios/Scenarios";
import { Letterer } from "./Cinematics/Letterer";
export var KILL;
(function (KILL) {
    var started = false;
    let MASKS;
    (function (MASKS) {
        MASKS[MASKS["UNDEFINED_OR_INIT"] = 0] = "UNDEFINED_OR_INIT";
        MASKS[MASKS["FONTS"] = 1] = "FONTS";
        MASKS[MASKS["SPRITES"] = 2] = "SPRITES";
        MASKS[MASKS["COUNT"] = 3] = "COUNT";
    })(MASKS = KILL.MASKS || (KILL.MASKS = {}));
    ;
    let words = 0b0;
    function checkin(word) {
        let mask = MASKS[word];
        const bit = 0b1 << mask;
        words |= bit;
        checkins();
    }
    KILL.checkin = checkin;
    function checkins() {
        let count = 0;
        let i = 0;
        for (; i < MASKS.COUNT; i++)
            (words & 0b1 << i) ? count++ : void (0);
        if (count == MASKS.COUNT)
            start();
    }
    function fault(mask) {
        console.error('fault ', mask);
    }
    KILL.fault = fault;
    function init() {
        console.log('kill init');
        checkin('UNDEFINED_OR_INIT');
        Phong2.rig();
        Rectangles.init();
        Surfaces.init();
        Blocks.init();
        BoxCutter.init();
        Sprites.init();
        Sheets.init();
        Cinematics.init();
        Letterer.init();
        Movie.init();
        KILL.city = new City;
    }
    KILL.init = init;
    function start() {
        if (started)
            return;
        console.log('kill starting');
        started = true;
        BridgeScenario.init();
        let data = {
            type: 'Ply',
            x: 10.5,
            y: 1,
            z: 0
        };
        data.remap = [40, 46, 47, 49, 50, 51][Math.floor(Math.random() * 6)];
        KILL.ply = new Ply(data);
        KILL.city.chunkList.get2(0, 0);
        KILL.city.chunkList.get2(0, 1);
    }
    KILL.start = start;
    function update() {
        if (!started)
            return;
        if (KILL.ply)
            KILL.ply.update();
        Zoom.update();
        Scenarios.update();
        KILL.city.update(KILL.ply.data);
    }
    KILL.update = update;
})(KILL || (KILL = {}));
export default KILL;
