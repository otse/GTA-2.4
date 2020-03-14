import { MeshPhongMaterial, PlaneBufferGeometry, Mesh, Color } from "three";
import Four from "../Four";
import { Letterer } from "./Letterer";
export class WordBox {
    constructor() {
        console.log('new talking head');
        //Sheets.center(`sty/talking heads/${name}_1.bmp`);
        this.make();
    }
    setText(text, delay = 650) {
        if (this.texture)
            this.texture.dispose();
        this.texture = Letterer.makeNiceText(text);
        if (this.mesh) {
            this.material.map = this.texture;
            this.materialShadow.map = this.texture;
            this.mesh.visible = false;
            this.meshShadow.visible = false;
            setTimeout(() => {
                this.mesh.visible = true;
                this.meshShadow.visible = true;
            }, delay);
        }
    }
    destroy() {
        this.geometry.dispose();
        this.material.dispose();
    }
    make() {
        this.material = new MeshPhongMaterial({
            map: this.texture,
            transparent: true,
            shininess: 0,
            depthTest: false
        });
        this.materialShadow = this.material.clone();
        this.materialShadow.opacity = 0.35;
        this.materialShadow.color = new Color(0x0);
        this.geometry = new PlaneBufferGeometry(64, 16, 1);
        const scale = 6;
        this.mesh = new Mesh(this.geometry, this.material);
        this.mesh.renderOrder = 2;
        this.mesh.scale.set(scale, scale, scale);
        this.mesh.visible = false;
        this.meshShadow = new Mesh(this.geometry, this.materialShadow);
        this.meshShadow.renderOrder = 1;
        this.meshShadow.scale.set(scale, scale, scale);
        this.meshShadow.visible = false;
        Four.scene.add(this.mesh);
        //Four.scene.add(this.meshShadow);
        console.log('make word box');
    }
    update() {
        let pos = Four.camera.position.clone();
        let x = pos.x + 100;
        let y = pos.y - 80;
        let z = pos.z - 200;
        this.mesh.position.set(x, y, z);
        this.meshShadow.position.set(x + 1, y - 1, z);
    }
}
;
window.WordBox = WordBox;
export default WordBox;
