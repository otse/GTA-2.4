import Object2 from "../Object";
import { default as THREE, Mesh } from "three";
import Four from "../../Four";
export class Wall extends Object2 {
    constructor(data) {
        super(data);
        this.make();
    }
    // Override
    destroy() {
        this.geometry = new THREE.PlaneBufferGeometry(8, 64, 1, 1);
        this.mesh = new Mesh(this.geometry, this.material);
        this.mesh.matrixAutoUpdate = false;
        this.mesh.frustumCulled = false;
        this.mesh.position.set(this.data.x * 64 + 32, this.data.y * 64 + 32, this.data.z * 64);
        super.destroy();
        Four.scene.add(this.mesh);
    }
    make() {
    }
}
export default Surface;
