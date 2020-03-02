import Rectangle from "./Rectangle";

import four from "../four";
import { default as THREE, Clock, Scene } from 'three';

// "C API" LOL
export namespace Rectangles {

	export function Init() {

	}

	export function show(rectangle: Rectangle) {
		console.log('Rectangles Add ' + rectangle.data.type);

		four.scene.add(rectangle.mesh);
		four.scene.add(rectangle.meshShadow);
	}

	export function hide(rectangle: Rectangle) {
		four.scene.remove(rectangle.mesh);
		four.scene.remove(rectangle.meshShadow);
	}
}

export default Rectangles;