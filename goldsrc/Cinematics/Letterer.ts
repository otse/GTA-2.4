import { default as THREE, LinearFilter, NearestFilter, Texture, TextureLoader, ImageLoader, CanvasTexture, LoadingManager } from "three";

import Four from "../Four";
import Util from "../Random";
import Points from "../Objects/Points";
import KILL from "../KILL";
import Spelling from "./Spelling";

export namespace Letterer {

	export var canvas;
	export var bigFont;
	export var smallFont;

	export function init() {
		canvas = document.createElement('canvas');

		document.body.appendChild(canvas);

		console.log('letterer init');

		//let manager = new LoadingManager();

		const error = () => {
			KILL.critical('FONT');
		};


		let loader = new ImageLoader();
		loader.load(
			'sty/fonts/small.png',
			(image) => {
				smallFont = image;
				KILL.resourced('SMALL_FONT');
			},
			undefined,
			error
		);

		let loader2 = new ImageLoader();
		loader2.load(
			'sty/fonts/big.png',
			(image) => {
				bigFont = image;
				KILL.resourced('BIG_FONT');
			},
			undefined,
			error
		);

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
					smallFont, symbol.x2, symbol.y2, symbol.w, symbol.h, symbol.x, symbol.y, symbol.w, symbol.h);
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