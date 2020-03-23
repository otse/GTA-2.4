import { MeshBasicMaterial, PlaneBufferGeometry, Mesh } from "three";
import Four from "../Four";
import Util from "../Random";
export class Element {
    constructor(pos) {
        console.log('ui element');
        this.pos = pos;
        this.make();
    }
    destroy() {
        this.geometry.dispose();
        this.material.dispose();
    }
    make() {
        this.material = new MeshBasicMaterial({
            map: Util.loadTexture(`sty/talking heads/guider_1.png`),
            color: 'red',
            transparent: true,
            depthTest: false
        });
        this.geometry = new PlaneBufferGeometry(this.pos.w, this.pos.h, 1);
        const scale = 1;
        this.mesh = new Mesh(this.geometry, this.material);
        this.mesh.renderOrder = 2;
        this.mesh.scale.set(scale, scale, scale);
        this.update();
        console.log('adding ui element');
        Four.scene.add(this.mesh);
    }
    update() {
        let cam = Four.camera.position.clone();
        let x = cam.x + this.pos.x;
        let y = cam.y + this.pos.y;
        let z = cam.z + this.pos.z - 500;
        this.mesh.position.set(x, y, z);
    }
}
;
window.UIElement = Element;
export default Element;