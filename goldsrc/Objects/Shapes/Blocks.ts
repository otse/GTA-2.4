import Data2 from "../Data";

import Block from "./Block";
import BoxCutter from "./Box cutter";

import { BoxBufferGeometry } from "three";

import Four from "../../Renderer";
import Util from "../../Random";

export namespace Blocks {
	export var geometry: BoxBufferGeometry

	export function Init() {
		geometry = new BoxBufferGeometry(64, 64, 64);

		Util.UV.RotatePlane(geometry, 0, 3);
		Util.UV.RotatePlane(geometry, 1, 1);
		Util.UV.RotatePlane(geometry, 2, 2);
	}

	function GetBits(data: Data2): string {
		let str = '';

		for (let i = 0; i < 5; i++)
			str += data.faces![i] ? '|' : 'O';

		str = str.toString().replace(/[\s,]/g, '');

		return str;
	}

	export function GetBox(block: Data2) {
		let bits = GetBits(block);

		let box = BoxCutter.geometries[bits];

		return box.clone();
	}

	export function show(block: Block) {
		Four.scene.add(block.mesh);
	}

	export function Hide(block: Block) {
		Four.scene.remove(block.mesh);
	}
}

export default Blocks;