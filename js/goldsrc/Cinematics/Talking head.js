import { MeshPhongMaterial, PlaneBufferGeometry, Mesh, Color } from "three";
import Util from "../Random";
import Four from "../Four";
export class TalkingHead {
    constructor(name) {
        console.log('new talking head');
        this.img1 = Util.loadTexture(`sty/talking heads/${name}_1.png`);
        this.img2 = Util.loadTexture(`sty/talking heads/${name}_2.png`);
        this.img3 = Util.loadTexture(`sty/talking heads/${name}_3.png`);
        //Sheets.center(`sty/talking heads/${name}_1.bmp`);
        this.make();
    }
    destroy() {
        this.geometry.dispose();
        this.material.dispose();
    }
    make() {
        this.material = new MeshPhongMaterial({
            map: this.img1,
            transparent: true,
            shininess: 0,
            depthTest: false
        });
        this.materialShadow = this.material.clone();
        this.materialShadow.opacity = 0.35;
        this.materialShadow.color = new Color(0x0);
        this.geometry = new PlaneBufferGeometry(64, 64, 1);
        this.mesh = new Mesh(this.geometry, this.material);
        this.meshShadow = new Mesh(this.geometry, this.materialShadow);
        this.mesh.renderOrder = 2;
        this.meshShadow.renderOrder = 1;
        Four.scene.add(this.mesh);
        Four.scene.add(this.meshShadow);
    }
    update() {
        let pos = Four.camera.position.clone();
        let x = pos.x + 150;
        let y = pos.y - 80;
        let z = pos.z - 200;
        this.mesh.position.set(x, y, z);
        this.meshShadow.position.set(x + 2, y - 2, z);
    }
}
;
window.TalkingHead = TalkingHead;
export default TalkingHead;
