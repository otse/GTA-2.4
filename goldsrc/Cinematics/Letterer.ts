import { default as THREE, LinearFilter, NearestFilter, Texture, TextureLoader, ImageLoader, CanvasTexture, LoadingManager } from "three";

import Four from "../Four";
import Util from "../Random";
import Points from "../Objects/Points";
import KILL from "../KILL";
import Spelling from "./Spelling";

export namespace Letterer {

	export var canvas;
	export var bigFont;

	export var paint: () => any;

	const bigAlphabetPos = [
		0, 33, 65, 96, 127, 152, 180, 212, 244, 261, 291, 327, 354, 393, 425, 456, 487, 519, 550, 580, 608, 640, 672, 711, 744, 777, 809];

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
				KILL.fault('FONTS');
			}
		);

	}

	var spriteTextures = [];

	export function makeNiceText(text: string): Texture {

		let spelling = Spelling.build(text, bigAlphabetPos);

		let canvasTexture = new CanvasTexture(canvas);

		paint = () => {

			canvasTexture.magFilter = NearestFilter;
			canvasTexture.minFilter = NearestFilter;

			const context = canvas.getContext("2d");

			canvas.width = 1024;
			canvas.height = 1024;

			for (let symbol of spelling.symbols) {

				if (' ' == symbol.char)
					continue;

				context.drawImage(
					bigFont, symbol.cx, symbol.cy, symbol.w, symbol.h, symbol.x, symbol.y, symbol.w, symbol.h);
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