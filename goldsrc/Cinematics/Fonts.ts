import { default as THREE, LinearFilter, NearestFilter, Texture, TextureLoader, ImageLoader, CanvasTexture, LoadingManager } from "three";

import Four from "../Four";
import Util from "../Random";
import Points from "../Objects/Points";
import KILL from "../KILL";
import Spelling from "./Spelling";

export namespace Fonts {

	export const fonts: { [key: string]: any } = {
		white: null,
		yellow: null,
		mission: null
	};

	export var canvas;

	export function init() {
		canvas = document.createElement('canvas');

		document.body.appendChild(canvas);

		console.log('letterer init');

		const get_font = (name, rs, func) => {

			new ImageLoader().load(`sty/fonts/${name}.png`,
				(img) => {
					func(img);
					KILL.resourced(rs);
				},
				() => { },
				() => KILL.critical(rs)
			);
		};

		get_font(
			`white`,
			`FONT_WHITE`,
			(e) => fonts.white = e);

		get_font(
			`yellow`,
			`FONT_YELLOW`,
			(e) => fonts.yellow = e);

		get_font(
			`mission`,
			`FONT_MISSION`,
			(e) => fonts.mission = e);
	}

	var spriteTextures = [];

	export function textTexture(text: string): Texture {

		let spelling = Spelling.build(text, 'small');

		let texture = new CanvasTexture(canvas);

		texture.magFilter = NearestFilter;
		texture.minFilter = NearestFilter;

		const paint = () => {

			const context = canvas.getContext("2d");

			canvas.width = 512;
			canvas.height = 128;

			for (let symbol of spelling.symbols) {

				let font = symbol.colorize ? Fonts.fonts.yellow : Fonts.fonts.white;

				context.drawImage(
					font, symbol.x2, symbol.y2, symbol.w, symbol.h, symbol.x, symbol.y, symbol.w, symbol.h);
			}

			let image = new Image();
			image.src = canvas.toDataURL();

			texture.image = image;
			texture.needsUpdate = true;
		}

		paint();

		return texture;
	}

}

export default Fonts;