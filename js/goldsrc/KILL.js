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
import HighWayWithEveryCar from "./Scenarios/Highway with every car";
export var KILL;
(function (KILL) {
    function init() {
        console.log('gta init');
        Phong2.rig();
        Rectangles.init();
        Surfaces.init();
        Blocks.init();
        BoxCutter.init();
        Sprites.init();
        Sheets.init();
        Movie.init();
        KILL.city = new City;
        window.KILL = KILL;
        //PalmTrees.init();
        HighWayWithEveryCar.init();
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
    KILL.init = init;
    function update() {
        if (KILL.ply)
            KILL.ply.update();
        Zoom.update();
        KILL.city.update(KILL.ply.data);
    }
    KILL.update = update;
})(KILL || (KILL = {}));
export default KILL;
