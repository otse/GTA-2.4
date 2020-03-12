import { default as THREE, LinearFilter, NearestFilter, Texture, TextureLoader, ImageLoader, CanvasTexture, LoadingManager } from "three";

import Four from "../Four";
import Util from "../Random";
import Points from "../Objects/Points";
import KILL from "../KILL";

export namespace Letterer {

	export var canvas;
	export var bigFont;

	export var paint: () => any;

	const alphabetPos = [
		0, 33, 65, 96, 127, 152, 180, 212, 244, 261, 291, 327, 354, 393, 425, 456, 487, 519, 550, 580, 608, 640, 672, 711, 744, 777
	]

	export function init() {
		canvas = document.createElement('canvas');

		document.body.appendChild(canvas);

		console.log('letterer init');

		let loader = new ImageLoader();
		loader.load(
			'sty/fonts/big.png',
			(image) => {
				bigFont = image;

				KILL.checkin(KILL.MASKS.FONTS);
			},
			undefined,
			() => {
				console.error('kill can\'t load font');
			}
		);

	}

	var spriteTextures = [];

	export function makeNiceText(words: string): Texture {

		let canvasTexture = new CanvasTexture(canvas);

		paint = () => {

			console.log('called paint cb ');

			canvasTexture.magFilter = NearestFilter;
			canvasTexture.minFilter = NearestFilter;

			const context = canvas.getContext("2d");

			canvas.width = 512;
			canvas.height = 512;

			for (let i = 0; i < words.length; i++) {
				let c = words[i];

				context.drawImage(
					bigFont,
					0,
					0,
					20,
					20,
					20,
					20,
					10,
					10);
			}

			context.fillStyle = "blue";

			context.font = "bold 32px Arial";
			context.fillText(words, 0, 30);

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