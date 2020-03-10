import Data2 from "../Data";
import Object2 from "../Object";

import Surfaces from "../Shapes/Surfaces";
import Sprites from "../../Sprites/Sprites";
import Sheets from "../../Sprites/Sheets";

import Util from "../../Random";

import { default as THREE, Mesh, Material, PlaneBufferGeometry, MeshPhongMaterial, Color, DoubleSide, Texture, Shader } from "three";
import Points from "../Points";
import Four from "../../Four";

export class Wall extends Object2 {

	mesh: Mesh
	material: Material
	geometry: PlaneBufferGeometry

	constructor(data: Data2) {
        super(data);

		this.make();
	}

	// Override
	destroy() {
		this.geometry = new THREE.PlaneBufferGeometry(8, 64, 1, 1);

        this.mesh = new Mesh(this.geometry, this.material);
		this.mesh.matrixAutoUpdate = false;
		this.mesh.frustumCulled = false;

        this.mesh.position.set(
			this.data.x * 64 + 32,
			this.data.y * 64 + 32,
            this.data.z * 64);
            
        super.destroy();
        
        Four.scene.add(this.mesh);
	}

	make() {

	}
}

export default Surface;