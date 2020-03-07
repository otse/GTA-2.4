import Object2 from "../Objects/Object";
import Rectangles from "../Objects/Rectangles";
import Phong2 from "../Shaders/Phong2";
import Util from "../Random";
import { default as THREE, Vector3, PlaneBufferGeometry } from 'three';
class Rectangle extends Object2 {
    constructor(data) {
        super(data);
        this.lift = 2;
        // the Defaults
        if (!this.data.width)
            this.data.width = 20;
        if (!this.data.height)
            this.data.height = 20;
        this.where = new Vector3;
        //Ready(); // used by consumer class
    }
    makeRectangle(params) {
        this.makeMeshes(params);
        this.updatePosition();
        Rectangles.show(this);
    }
    makeMeshes(info) {
        let map = Util.loadTexture(this.data.sty);
        let blurMap = Util.loadTexture(info.blur);
        let shadowMap = Util.loadTexture(info.blur);
        this.geometry = new PlaneBufferGeometry(this.data.width, this.data.height, 1);
        this.material = Phong2.makeRectangle({
            name: 'Phong2',
            transparent: true,
            map: map,
            blending: THREE.NormalBlending
        }, {
            PINK: true,
            blurMap: blurMap,
        });
        let materialShadow = Phong2.makeRectangleShadow({
            name: 'Phong2 Shadow',
            transparent: true,
            map: map,
        }, {
            PINK: true
        });
        materialShadow.opacity = 0.25;
        materialShadow.color = new THREE.Color(0x0);
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.frustumCulled = false;
        this.meshShadow = new THREE.Mesh(this.geometry, materialShadow);
        this.meshShadow.frustumCulled = false;
    }
    destroy() {
        super.destroy();
        Rectangles.hide(this);
        this.geometry.dispose();
        this.material.dispose();
    }
    update() {
        super.update();
    }
    updatePosition() {
        this.where.set(this.data.x * 64, this.data.y * 64, this.data.z * 64);
        this.mesh.position.copy(this.where);
        this.mesh.position.z += this.lift;
        // Shade
        this.meshShadow.position.copy(this.where);
        this.meshShadow.position.x += 3;
        this.meshShadow.position.y -= 3;
        this.mesh.rotation.z = this.data.r;
        this.meshShadow.rotation.z = this.data.r;
    }
}
export default Rectangle;
