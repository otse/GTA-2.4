import Data2 from "../Data";

import Block from "./Block";
import BoxCutter from "./Box cutter";

import { BoxBufferGeometry } from "three";

import Four from "../../Four";
import Util from "../../Random";

export namespace Blocks {
	export var geometry: BoxBufferGeometry

	export function init() {
		geometry = new BoxBufferGeometry(64, 64, 64);

		Util.UV.rotatePlane(geometry, 0, 3);
		Util.UV.rotatePlane(geometry, 1, 1);
		Util.UV.rotatePlane(geometry, 2, 2);
	}

	function getBits(data: Data2): string {
		let str = '';

		for (let i = 0; i < 5; i++)
			str += data.faces![i] ? '|' : 'O';

		str = str.toString().replace(/[\s,]/g, '');

		return str;
	}

	export function getBox(block: Data2) {
		let bits = getBits(block);

		let box = BoxCutter.geometries[bits];

		return box.clone();
	}

	export function show(block: Block) {
		Four.scene.add(block.mesh);
	}

	export function hide(block: Block) {
		Four.scene.remove(block.mesh);
	}
}

export default Blocks;