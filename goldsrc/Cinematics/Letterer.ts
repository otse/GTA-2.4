import { default as THREE, LinearFilter, NearestFilter, Texture, TextureLoader, ImageLoader, CanvasTexture, LoadingManager } from "three";

import Four from "../Four";
import Util from "../Random";
import Points from "../Objects/Points";
import KILL from "../KILL";
import Spelling from "./Spelling";

export namespace Letterer {

	export var canvas;
	export var missionFont;
	export var smallWhite;
	export var smallYellow;

	export function init() {
		canvas = document.createElement('canvas');

		document.body.appendChild(canvas);

		console.log('letterer init');

		//let manager = new LoadingManager();

		const load = (path, resource, func: (image) => any) => {
			let loader = new ImageLoader();
			let image;
			loader.load(
				path,
				(out) => {
					func(out);
					KILL.resourced(resource);
				},
				undefined,
				() => KILL.critical(resource)
			);
		};

		load('sty/fonts/small.png', 'SMALL_FONT', (image) => smallWhite = image);
		load('sty/fonts/small_yellow.png', 'SMALL_FONT_YELLOW', (image) => smallYellow = image);
		load('sty/fonts/big.png', 'BIG_FONT', (image) => missionFont = image);
	}

	var spriteTextures = [];

	export function makeNiceText(text: string): Texture {

		let spelling = Spelling.build(text, 'small');

		let canvasTexture = new CanvasTexture(canvas);

		const paint = () => {

			canvasTexture.magFilter = NearestFilter;
			canvasTexture.minFilter = NearestFilter;

			const context = canvas.getContext("2d");

			canvas.width = 512;
			canvas.height = 128;

			for (let symbol of spelling.symbols) {
				
				context.drawImage(
					symbol.color ? smallYellow : smallWhite, symbol.x2, symbol.y2, symbol.w, symbol.h, symbol.x, symbol.y, symbol.w, symbol.h);
			}

			let image = new Image();
			image.src = canvas.toDataURL();

			canvasTexture.image = image;
			canvasTexture.needsUpdate = true;
		}

		paint();

		return canvasTexture;
	}

}

export default Letterer;