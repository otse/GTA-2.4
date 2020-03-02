import four from "./four";

import KILL from "./KILL";

import "./Chunks/Chunk list";
import "./Chunks/Chunk";
import "./Chunks/Chunks";
import "./Chunks/City";


//import { default as THREE } from 'three';
//export { THREE };

export const enum KEY {
	OFF = 0,
	UP = 0,
	PRESSED,
	DELAY,
	AGAIN
}

export namespace app {

	export var map = {};
	export var wheel = 0;

	export var move: Zx = [0, 0];

	export var left = false;

	function onkeys(event) {
		const key = event.key;

		//console.log(event);

		if ('keydown' == event.type)
			map[key] = (undefined == map[key])
				? KEY.PRESSED
				: KEY.AGAIN;

		else if ('keyup' == event.type)
			map[key] = KEY.UP;

		if (key == 114) // f3
			event.preventDefault();

		return;
	}

	function onwheel(event) {
		let up = event.deltaY < 0;
		wheel = up ? 1 : -1;
	}

	function onmove(event) {
		move[0] = event.clientX;
		move[1] = event.clientY;
	}

	function ondown(event) {
		if (event.button == 0)
			left = true;
	}

	function onup(event) {
		if (event.button == 0)
			left = false;
	}

	export function boot() {

		document.onkeydown = document.onkeyup = onkeys;
		document.onmousemove = onmove;
		document.onmousedown = ondown;
		document.onmouseup = onup;
		document.onwheel = onwheel;

		four.init();

		KILL.init();

		loop(0);
	}

	const delay = () => {

		for (let i in map) {

			if (KEY.PRESSED == map[i])
				map[i] = KEY.DELAY;

			else if (KEY.UP == map[i])
				delete map[i];
		}
	}

	const loop = (timestamp) => {

		requestAnimationFrame(loop);

		KILL.update();

		four.render();

		wheel = 0;

		delay();
	}
}

window['app'] = app;

export default app;