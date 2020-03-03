import Surface from "./Surface";

import Four from "../../Renderer";

import { default as THREE, Clock, Scene, Mesh, Vector3, ShaderMaterial, PlaneBufferGeometry, MeshPhongMaterial } from 'three';


export namespace Surfaces {
	export var geometry: THREE.PlaneBufferGeometry

	export function Init() {
		this.geometry = new THREE.PlaneBufferGeometry(64, 64, 1, 1);
	}

	export function Show(plane: Surface) {
		Four.scene.add(plane.mesh);
	}

	export function Hide(plane: Surface) {
		Four.scene.remove(plane.mesh);
	}
}

export default Surfaces;