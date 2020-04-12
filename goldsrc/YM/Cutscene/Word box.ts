import Data2 from "../../Objects/Data";
import Datas from "../../Objects/Datas";
import { MeshPhongMaterial, PlaneBufferGeometry, Mesh, Texture, Color } from "three";
import Util from "../../Random";
import Sheets from "../../Sprites/Sheets";
import Four from "../../Four";
import { Fonts } from "../Fonts";
import Widget from "../Widget";

export class WordBox {
	widget: Widget

	texture: Texture

	constructor() {
		this.make();
	}

	destroy() {
		this.widget.destroy();
	}

	make() {
		this.widget = new Widget(
			{
				x: 250,
				y: -250,
				z: 0,
				w: 512,
				h: 128
			});
			
		this.widget.scale = 3;

		this.widget.material.map = this.texture;
	}

	setText(text: string, delay = 650) {
		if (this.texture)
			this.texture.dispose();
		this.texture = Fonts.textTexture(text, 512, 128);
		//if (this.mesh) {
		this.widget.material.map = this.texture;
		this.widget.mesh.visible = false;
		setTimeout(() => {
			this.widget.mesh.visible = true;
		}, delay);
		//}
	}

	update() {
		this.widget.update();

		//let pos = Four.camera.position.clone();
		//let x = pos.x + 100 * Four.aspect;
		//let y = pos.y - 80;
		//let z = pos.z - 200;

		//this.mesh.position.set(x, y, z);
		//this.meshShadow.position.set(x + 1, y - 1, z);
	}

};

(window as any).WordBox = WordBox;

export default WordBox;