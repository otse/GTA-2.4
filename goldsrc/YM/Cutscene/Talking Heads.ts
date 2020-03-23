import Data2 from "../../Objects/Data";
import Datas from "../../Objects/Datas";
import { MeshPhongMaterial, PlaneBufferGeometry, Mesh, Texture, Color, Camera, ArrowHelper } from "three";
import Util from "../../Random";
import Sheets from "../../Sprites/Sheets";
import Four from "../../Four";
import Widget from "../Widget";
import App from "../../App";

// Apparently a band

export class TalkingHead {
	widget: Widget

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
				this.widget.material.map = this.imgs[0];
			}, delay);
	}

	destroy() {
		this.widget.destroy();
	}

	make() {
		this.widget = new Widget({ x: 350, y: -200, z: 0, w: 200, h: 200 });
	}

	update() {

		if (this.animateMouth) {
			this.talkTime += Four.delta;

			if (this.talkTime > 0.2) {
				this.img = this.img < 2 ? this.img + 2 : 0;
				this.widget.material.map = this.imgs[this.img];
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
				this.widget.material.map = this.imgs[0];
			}
			else if (this.blinkTime > 0) {
				this.widget.material.map = this.imgs[1];
			}
		}

		this.widget.update();

		const s = 10;

		if (App.map[39]) // right
			this.widget.pos.x += s;
		if (App.map[37]) // left
			this.widget.pos.x -= s;
		if (App.map[38]) // up
			this.widget.pos.y += s;
		if (App.map[40]) // down
			this.widget.pos.y -= s;

		//console.log(this.widget.pos);
	}

};

(window as any).TalkingHead = TalkingHead;

export default TalkingHead;