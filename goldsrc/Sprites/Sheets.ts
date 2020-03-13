import Sheet from "./Sheet";
import { default as THREE, NearestFilter, Texture, TextureLoader, CanvasTexture, LinearFilter } from "three";
import Four from "../Four";
import Util from "../Random";
import Points from "../Objects/Points";
import KILL from "../KILL";

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

		console.log('sheets init');

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
		put('blueRoads', clone(baseRoads, { file: 'sty/sheets/blue_roads.bmp' }));
		put('qualityRoads', clone(baseRoads, { file: 'sty/sheets/quality_roads.bmp' }));
		put('mixedRoads', clone(baseRoads, { file: 'sty/sheets/mixed_roads.png' }));
		put('greyRoads', clone(baseRoads, { file: 'sty/sheets/grey_roads.png' }));
		put('greyRoadsMixed', clone(baseRoads, { file: 'sty/sheets/grey_roads_mixed.png' }));
		put('yellowyPavement', clone(basePavement, { file: 'sty/sheets/yellowy_pavement.png' }));
		put('greenPavement', clone(basePavement, { file: 'sty/sheets/green_pavement.png' }));

		KILL.resourced('SPRITES');

	}

	var spriteTextures = [];

	// Cut sprite from sheet
	export function cut(sheet: Sheet, sprite: Square): Texture {

		// 
		const key = `sh ${sheet} sp ${Points.string(sprite)}`;

		if (spriteTextures[key])
			return spriteTextures[key];

		let canvasTexture =
			new CanvasTexture(canvas);

		canvasTexture.magFilter = NearestFilter;
		canvasTexture.minFilter = NearestFilter;

		spriteTextures[key] = canvasTexture;

		let callback = (texture: Texture) => {

			const context = canvas.getContext("2d");

			canvas.width = sheet.piece.w;
			canvas.height = sheet.piece.h;

			context.drawImage(
				texture.image,
				(sprite.x - 1) * -sheet.piece.w, (sprite.y - 1) * -sheet.piece.h);

			let image = new Image();
			image.src = canvas.toDataURL();

			canvasTexture.image = image;
			canvasTexture.needsUpdate = true;
		}

		// optimize re-loading here
		let fakeTexture = new TextureLoader().load(sheet.file, callback, undefined, undefined);

		return canvasTexture;
	}

	export function center(path: string): Texture {

		let canvasTexture =
			new CanvasTexture(canvas);

		let callback = (texture: Texture) => {

			console.log('callback');

			const context = canvas.getContext("2d");

			canvas.width = texture.image.width;
			canvas.height = texture.image.height;

			context.drawImage(
				texture.image,
				0, 0);

			let imgData = context.getImageData(0, 0, canvas.width, canvas.height);
			const pixels = imgData.data;

			for (let y = 0; y < canvas.height; y++) {
				for (let x = 0; x < canvas.width; x++) {
					break;
					let z = y * canvas.width * 4;
					const get = (n) => {
						return pixels[z + x * 4 + n];
					}
					const set = (n, m) => {
						return pixels[z + x * 4 + n] = m;
					}
					if (get(0) == 0 || get(1) == 0 || get(2) == 0) {
						set(0, 255);
						set(1, 255);
						set(2, 255);
					}
				}
				break;
			}

			//let ox = Math.ceil((T - bmp.width) / 2) + 1;
			//let oy = Math.ceil((T - bmp.height) / 2) + 1;

			context.putImageData(imgData, 0, 0);
			// Now

			let image = new Image();
			image.src = canvas.toDataURL();

			canvasTexture.image = image;
			canvasTexture.needsUpdate = true;
		}

		let fakeTexture = new TextureLoader().load(path, callback, undefined, undefined);

		return canvasTexture;
	}

}

export default Sheets;