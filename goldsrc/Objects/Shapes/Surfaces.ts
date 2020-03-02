import four from '@app/four';
import { default as THREE, Clock, Scene, Mesh, Vector3, ShaderMaterial, PlaneBufferGeometry, MeshPhongMaterial } from 'three';

import Surface from "./Surface";

export namespace Surfaces {
      export var geometry: THREE.PlaneBufferGeometry

      export function Init() {
            this.geometry = new THREE.PlaneBufferGeometry(64, 64, 1, 1);
      }

      export function Show(plane: Surface) {
		four.scene.add(plane.mesh);
	}

	export function Hide(plane: Surface) {
		four.scene.remove(plane.mesh);
	}
}

export default Surfaces;