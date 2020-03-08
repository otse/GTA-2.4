import Sheet from "./Sheet";

export namespace Sheets {

    type Lookup = { [index: string]: Readonly<Sheet> }

    const sheets: Lookup = {};

    export function get(name: string): Readonly<Sheet> {
        return sheets[name];
    }

    export function put(name: string, object: object) {
        sheets[name] = object as Sheet;
    }

    export function clone(target, source) {
        let clone = JSON.parse(JSON.stringify(target));

        Object.assign(clone, source);

        return clone;
    }

    export var canvas;

    export function init() {
        canvas = document.createElement('canvas');

        document.body.appendChild(canvas);

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
        }

        put('badRoads', clone(baseRoads, { file: 'sty/sheets/bad_roads.png' }));
        put('greenRoads', clone(baseRoads, { file: 'sty/sheets/green_roads.png' }));
        put('mixedRoads', clone(baseRoads, { file: 'sty/sheets/mixed_roads.png' }));
        put('greyRoads', clone(baseRoads, { file: 'sty/sheets/grey_roads.png' }));
        put('yellowyPavement', clone(basePavement, { file: 'sty/sheets/yellowy_pavement.png' }));
        put('greenPavement', clone(basePavement, { file: 'sty/sheets/green_pavement.png' }));

    }

}

export default Sheets;