import Rectangle from "./Rectangle";

import Four from "../Four";
import { default as THREE, Clock, Scene } from 'three';

// "C API" LOL
export namespace Rectangles {

	export function init() {

	}

	export function show(rectangle: Rectangle) {
		Four.scene.add(rectangle.meshShadow);
		Four.scene.add(rectangle.mesh);
	}

	export function hide(rectangle: Rectangle) {
		Four.scene.remove(rectangle.meshShadow);
		Four.scene.remove(rectangle.mesh);
	}
}

export default Rectangles;