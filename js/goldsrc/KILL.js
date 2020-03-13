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
import HighWayWithEveryCar from "./Scenarios/Highway";
import Cinematics from "./Cinematics/Cinematics";
import Scenarios from "./Scenarios/Scenarios";
import Letterer from "./Cinematics/Letterer";
import { Rain as Rain } from "./Unsorted/Minecraft rain";
import Water from "./Unsorted/Water";
import Mist from "./Unsorted/Mist";
export var KILL;
(function (KILL) {
    var started = false;
    let RESOURCES;
    (function (RESOURCES) {
        RESOURCES[RESOURCES["UNDEFINED_OR_INIT"] = 0] = "UNDEFINED_OR_INIT";
        RESOURCES[RESOURCES["SMALL_FONT"] = 1] = "SMALL_FONT";
        RESOURCES[RESOURCES["BIG_FONT"] = 2] = "BIG_FONT";
        RESOURCES[RESOURCES["SPRITES"] = 3] = "SPRITES";
        RESOURCES[RESOURCES["COUNT"] = 4] = "COUNT";
    })(RESOURCES = KILL.RESOURCES || (KILL.RESOURCES = {}));
    ;
    let words = 0b0;
    function resourced(word) {
        let mask = RESOURCES[word];
        const bit = 0b1 << mask;
        words |= bit;
        can_we_begin_yet();
    }
    KILL.resourced = resourced;
    function can_we_begin_yet() {
        let count = 0;
        let i = 0;
        for (; i < RESOURCES.COUNT; i++)
            (words & 0b1 << i) ? count++ : void (0);
        if (count == RESOURCES.COUNT)
            start();
    }
    function critical(mask) {
        console.error('resource', mask);
    }
    KILL.critical = critical;
    function init() {
        console.log('kill init');
        resourced('UNDEFINED_OR_INIT');
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
        Water.init();
        Mist.init();
        Rain.init();
        KILL.city = new City;
        window.KILL = KILL;
    }
    KILL.init = init;
    function start() {
        if (started)
            return;
        console.log('kill starting');
        started = true;
        HighWayWithEveryCar.init();
        //BridgeScenario.init();
        let data = {
            type: 'Ply',
            //remap: 16,
            x: 10.5,
            y: 1,
            z: 0
        };
        //data.remap = [40, 46, 47, 49, 50, 51][Math.floor(Math.random() * 6)];
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
        Water.update();
        Mist.update();
        Rain.update();
        Zoom.update();
        Scenarios.update();
        KILL.city.update(KILL.ply.data);
    }
    KILL.update = update;
})(KILL || (KILL = {}));
export default KILL;
