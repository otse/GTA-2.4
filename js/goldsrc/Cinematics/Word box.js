import { MeshPhongMaterial, PlaneBufferGeometry, Mesh, Color } from "three";
import Four from "../Four";
import { Letterer } from "./Letterer";
export class WordBox {
    constructor(words) {
        console.log('new talking head');
        this.img1 = Letterer.makeNiceText(words);
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
        this.materialShadow.opacity = 0.25;
        this.materialShadow.color = new Color(0x0);
        this.geometry = new PlaneBufferGeometry(64, 16, 1);
        const scale = 5;
        this.mesh = new Mesh(this.geometry, this.material);
        this.mesh.renderOrder = 2;
        this.mesh.scale.set(scale, scale, scale);
        this.meshShadow = new Mesh(this.geometry, this.materialShadow);
        this.meshShadow.renderOrder = 1;
        this.meshShadow.scale.set(scale, scale, scale);
        Four.scene.add(this.mesh);
        Four.scene.add(this.meshShadow);
        console.log('make word box');
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
window.WordBox = WordBox;
export default WordBox;
