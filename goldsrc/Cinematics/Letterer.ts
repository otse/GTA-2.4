import { default as THREE, LinearFilter, NearestFilter, Texture, TextureLoader, ImageLoader, CanvasTexture, LoadingManager } from "three";

import Four from "../Four";
import Util from "../Random";
import Points from "../Objects/Points";
import KILL from "../KILL";
import Spelling from "./Spelling";

export namespace Letterer {

	export var canvas;
	export var bigFont;

	const bigAlphabetPos = [
		0, 33, 65, 96, 127, 152, 180, 212, 244, 261, 291, 327, 354, 393, 425, 456, 487, 519, 550, 580, 608, 640, 672, 711, 744, 777, /* this is after z*/ 809, // z
		0, 22, 54, 85, 120, 150, 181, 211, 242, 274, 306, 323, 340, 371, 388, 405, 442, 459, 490, 507, 540, 562, 583
	];

	export function init() {
		canvas = document.createElement('canvas');

		document.body.appendChild(canvas);

		console.log('letterer init');

		let loader = new ImageLoader();
		loader.load(
			'sty/fonts/big.png',
			(image) => {
				bigFont = image;

				KILL.checkin('FONTS');
			},
			undefined,
			() => {

				KILL.fault('BIG FONT');
			}
		);

	}

	var spriteTextures = [];

	export function makeNiceText(text: string): Texture {

		let spelling = Spelling.build(text, bigAlphabetPos);

		let canvasTexture = new CanvasTexture(canvas);

		const paint = () => {

			canvasTexture.magFilter = NearestFilter;
			canvasTexture.minFilter = NearestFilter;

			const context = canvas.getContext("2d");

			canvas.width = 1024;
			canvas.height = 256;

			for (let symbol of spelling.symbols) {

				context.drawImage(
					bigFont, symbol.x2, symbol.y2, symbol.w, symbol.h, symbol.x, symbol.y, symbol.w, symbol.h);
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

export default Sheets;