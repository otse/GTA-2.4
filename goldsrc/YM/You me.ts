import { default as THREE, OrthographicCamera, CanvasTexture, NearestFilter, Font } from "three";
import Four from "../Four";
import { Shift } from "../Unsorted/Shift";
import Fonts from "./Fonts";

export class Thing {
	constructor() {

	}
}

export namespace YM {

	export let canvas;
	export let context;
	export let canvasTexture: CanvasTexture;

	export function init() {

		console.log('ym init');

		canvas = document.createElement('canvas');

		document.body.appendChild(canvas);

		context = canvas.getContext("2d");

		canvasTexture = new CanvasTexture(canvas);

		canvasTexture.magFilter = NearestFilter;
		canvasTexture.minFilter = NearestFilter;

		//Shift.effect.uniforms['tUI'].value = canvasTexture;

		resize();

		refresh();
	}

	export function resize() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}

	let firstUpdate = true;
	export function update() {
		if (firstUpdate) {
			console.log('first update');

			drawth(null);

			canvasTexture.needsUpdate = true;

			firstUpdate = false;
		}
	}

	export function refresh() {
		//context.drawImage(
		//font, s.x2, s.y2, s.w, s.h, s.x, s.y, s.w, s.h);
		canvasTexture.needsUpdate = true;
	}

	export function drawth(th: Thing) {
		//context.fillStyle = 'rgba(255, 0, 255, 1)';
		//context.fillRect(0, 0, 100, 100);

		//Fonts.textOnto(canvas, "Bearing too much weight, will eventually cause the collapse of everything.", 512, 128);
		//context.drawImage(, s.x2, s.y2, s.w, s.h, s.x, s.y, s.w, s.h);
	}
}

export default YM;