import { NearestFilter, TextureLoader, CanvasTexture } from "three";
import Points from "../Objects/Points";
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
    var spriteTextures = [];
    // Cut sprite from sheet
    function cut(sheet, sprite) {
        // 
        const key = `sh ${sheet} sp ${Points.string(sprite)}`;
        if (spriteTextures[key])
            return spriteTextures[key];
        let spriteTexture = new CanvasTexture(Sheets.canvas);
        spriteTexture.magFilter = NearestFilter;
        spriteTexture.minFilter = NearestFilter;
        spriteTextures[key] = spriteTexture;
        let callback = (texture) => {
            const context = Sheets.canvas.getContext("2d");
            Sheets.canvas.width = sheet.piece.w;
            Sheets.canvas.height = sheet.piece.h;
            context.drawImage(texture.image, (sprite.x - 1) * -sheet.piece.w, (sprite.y - 1) * -sheet.piece.h);
            let image = new Image();
            image.src = Sheets.canvas.toDataURL();
            spriteTexture.image = image;
            spriteTexture.needsUpdate = true;
        };
        let sheetTexture = new TextureLoader().load(sheet.file, callback, undefined, undefined);
        return spriteTexture;
    }
    Sheets.cut = cut;
})(Sheets || (Sheets = {}));
export default Sheets;
