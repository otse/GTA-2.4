import Sheet from "./Sheet";
import { default as THREE, NearestFilter, Texture, TextureLoader, CanvasTexture } from "three";
import Four from "../Four";
import Util from "../Random";
import Points from "../Objects/Points";

export namespace Sheets {

    type Lookup = { [index: string]: Readonly<Sheet> }

    const sheets: Lookup = {};

    export function get(name: string): Readonly<Sheet> {
        return sheets[name!];
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
        put('greyRoadsMixed', clone(baseRoads, { file: 'sty/sheets/grey_roads_mixed.png' }));
        put('yellowyPavement', clone(basePavement, { file: 'sty/sheets/yellowy_pavement.png' }));
        put('greenPavement', clone(basePavement, { file: 'sty/sheets/green_pavement.png' }));

    }

	var spriteTextures = [];

    // Cut sprite from sheet
	export function cut(sheet: Sheet, sprite: Square): THREE.Texture {

		// 
		const key = `sh ${sheet} sp ${Points.string(sprite)}`;
		
		if (spriteTextures[key])
			return spriteTextures[key];

		let spriteTexture =
			new CanvasTexture(canvas);

		spriteTexture.magFilter = NearestFilter;
		spriteTexture.minFilter = NearestFilter;

		spriteTextures[key] = spriteTexture;

		let callback = (texture: Texture) => {

			const context = canvas.getContext("2d");

			canvas.width = sheet.piece.w;
			canvas.height = sheet.piece.h;

			context.drawImage(
				texture.image,
				(sprite.x - 1) * -sheet.piece.w, (sprite.y - 1) * -sheet.piece.h);

			let image = new Image();
			image.src = canvas.toDataURL();

			spriteTexture.image = image;
			spriteTexture.needsUpdate = true;
		}

		let sheetTexture = new TextureLoader().load(sheet.file, callback, undefined, undefined);

		return spriteTexture;
	}

}

export default Sheets;