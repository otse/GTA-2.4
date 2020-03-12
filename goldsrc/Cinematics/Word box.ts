import Data2 from "../Objects/Data";
import Datas from "../Objects/Datas";
import { MeshPhongMaterial, PlaneBufferGeometry, Mesh, Texture, Color } from "three";
import Util from "../Random";
import Sheets from "../Sprites/Sheets";
import Four from "../Four";
import { Letterer } from "./Letterer";

export class WordBox {
	mesh: Mesh
	meshShadow: Mesh

	material: MeshPhongMaterial
	materialShadow: MeshPhongMaterial
	geometry: PlaneBufferGeometry

	img1: Texture

	constructor(words: string) {
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

		this.mesh = new Mesh(this.geometry, this.material);
		this.mesh.renderOrder = 2;
		this.mesh.scale.set(5, 5, 5);
		
		this.meshShadow = new Mesh(this.geometry, this.materialShadow);
		this.meshShadow.renderOrder = 1;
		this.meshShadow.scale.set(5, 5, 5);

		Four.scene.add(this.mesh);
		Four.scene.add(this.meshShadow);

		console.log('make word box');
	}

	update() {
		let pos = Four.camera.position.clone();
		let x = pos.x + 100;
		let y = pos.y;
		let z = pos.z - 200;

		this.mesh.position.set(x, y, z);
		this.meshShadow.position.set(x + 2, y - 2, z);
	}

};

(window as any).WordBox = WordBox;

export default WordBox;