export var Sheets;
(function (Sheets) {
    const sheets = {};
    function get(name) {
        return sheets[name];
    }
    Sheets.get = get;
    function put(name, object) {
        sheets[name] = object;
    }
    Sheets.put = put;
    function clone(target, source) {
        let clone = JSON.parse(JSON.stringify(target));
        Object.assign(clone, source);
        return clone;
    }
    Sheets.clone = clone;
    function init() {
        Sheets.canvas = document.createElement('canvas');
        document.body.appendChild(Sheets.canvas);
        console.log('Spritesheets init');
        let baseRoads = {
            width: 320,
            height: 320,
            piece: { w: 64, h: 64 }
        };
        let basePavement = {
            width: 256,
            height: 256,
            piece: { w: 64, h: 64 }
        };
        put('badRoads', clone(baseRoads, { file: 'sty/sheets/bad_roads.png' }));
        put('greenRoads', clone(baseRoads, { file: 'sty/sheets/green_roads.png' }));
        put('mixedRoads', clone(baseRoads, { file: 'sty/sheets/mixed_roads.png' }));
        put('greyRoads', clone(baseRoads, { file: 'sty/sheets/grey_roads.png' }));
        put('greyRoadsMixed', clone(baseRoads, { file: 'sty/sheets/grey_roads_mixed.png' }));
        put('yellowyPavement', clone(basePavement, { file: 'sty/sheets/yellowy_pavement.png' }));
        put('greenPavement', clone(basePavement, { file: 'sty/sheets/green_pavement.png' }));
    }
    Sheets.init = init;
})(Sheets || (Sheets = {}));
export default Sheets;
