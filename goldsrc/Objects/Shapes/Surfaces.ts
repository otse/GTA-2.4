import Surface from "./Surface";

import Four from "../../Four";

import { default as THREE, Clock, Scene, Mesh, Vector3, ShaderMaterial, PlaneBufferGeometry, MeshPhongMaterial } from 'three';


export namespace Surfaces {
	export var geometry: THREE.PlaneBufferGeometry

	export function init() {
		this.geometry = new THREE.PlaneBufferGeometry(64, 64, 1, 1);
	}

	export function show(plane: Surface) {
		Four.scene.add(plane.mesh);
	}

	export function hide(plane: Surface) {
		Four.scene.remove(plane.mesh);
	}
}

export default Surfaces;