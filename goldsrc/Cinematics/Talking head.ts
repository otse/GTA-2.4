import Data2 from "../Objects/Data";
import Datas from "../Objects/Datas";
import { MeshPhongMaterial, PlaneBufferGeometry, Mesh, Texture, Color, Camera } from "three";
import Util from "../Random";
import Sheets from "../Sprites/Sheets";
import Four from "../Four";

export class TalkingHead {
	mesh: Mesh
	meshShadow: Mesh

	material: MeshPhongMaterial
	materialShadow: MeshPhongMaterial
	geometry: PlaneBufferGeometry

	talkTime: number
	blinkTime: number
	blinkDelay: number
	openEyesDelay: number
	img: number
	imgs: Texture[]

	animateMouth: boolean

	constructor(name: string) {
		console.log('new talking head');

		this.talkTime = 0;
		this.blinkTime = 0;
		this.blinkDelay = 3;
		this.openEyesDelay = 0.1;
		this.img = 0;
		this.imgs = [];
		this.imgs.push(Util.loadTexture(`sty/talking heads/${name}_1.png`));
		this.imgs.push(Util.loadTexture(`sty/talking heads/${name}_2.png`));
		this.imgs.push(Util.loadTexture(`sty/talking heads/${name}_3.png`));

		this.animateMouth = true;
		//Sheets.center(`sty/talking heads/${name}_1.bmp`);

		this.make();
	}

	talk(aye, delay = 0) {
		if (aye)
			this.animateMouth = true;
		else
			setTimeout(() => {
				this.animateMouth = false;
				this.blinkTime = .11;
				this.blinkDelay = 3;
				this.material.map = this.imgs[0];
			}, delay);
	}

	destroy() {
		this.geometry.dispose();
		this.material.dispose();
	}

	make() {
		this.material = new MeshPhongMaterial({
			map: this.imgs[0],
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

		if (this.animateMouth) {
			this.talkTime += Four.delta;

			if (this.talkTime > 0.2) {
				this.img = this.img < 2 ? this.img + 2 : 0;
				this.material.map = this.imgs[this.img];
				this.talkTime = 0;
			}
		}
		else {
			this.blinkTime += Four.delta;

			if (this.blinkTime > this.blinkDelay) {
				this.blinkTime = 0;
				this.blinkDelay = 3 + Math.random() * 3;
			}
			else if (this.blinkTime > 0.11) {
				this.material.map = this.imgs[0];
			}
			else if (this.blinkTime > 0) {
				this.material.map = this.imgs[1];
			}

		}

		let pos = Four.camera.position.clone();
		let x = pos.x + 100 * Four.aspect;
		let y = pos.y - 80;
		let z = pos.z - 200;

		this.mesh.position.set(x, y, z);
		this.meshShadow.position.set(x + 2, y - 2, z);
	}

};

(window as any).TalkingHead = TalkingHead;

export default TalkingHead;