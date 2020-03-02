import City from "./Chunks/City";
export var KILL;
(function (KILL) {
    function init() {
        console.log('gta init');
        KILL.city = new City;
    }
    KILL.init = init;
    function update() {
    }
    KILL.update = update;
})(KILL || (KILL = {}));
export default KILL;
