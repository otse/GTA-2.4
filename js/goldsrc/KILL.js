import City from "./Chunks/City";
import Ply from "./Pawns/Ply";
import Zoom from "./Unsorted/Zoom";
export var KILL;
(function (KILL) {
    function init() {
        console.log('gta init');
        KILL.city = new City;
        let data = {
            type: 'Ply',
            x: 10.5,
            y: 1
        };
        data.remap = [40, 46, 47, 49, 50, 51][Math.floor(Math.random() * 6)];
        KILL.ply = new Ply(data);
        KILL.city.chunkList.Get2(0, 0);
        KILL.city.chunkList.Get2(0, 1);
    }
    KILL.init = init;
    function update() {
        Zoom.update();
        KILL.city.update(KILL.ply.data);
    }
    KILL.update = update;
})(KILL || (KILL = {}));
export default KILL;
