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

	t = .11
	speed = 0.19
	limit = 0
	wordsSpoken = 0
	blink = true
	blinkDelay = 2
	openEyesDelay = 0.1
	img = 0
	imgs: Texture[] = []

	talk = false

	constructor(name: string) {
		console.log('new talking head');

		this.imgs.push(Util.loadTexture(`sty/talking heads/${name}_1.png`));
		this.imgs.push(Util.loadTexture(`sty/talking heads/${name}_2.png`));
		this.imgs.push(Util.loadTexture(`sty/talking heads/${name}_3.png`));

		//Sheets.center(`sty/talking heads/${name}_1.bmp`);

		this.make();
	}

	set_speed(speed = 0.2) {
		this.speed = speed;
	}

	speak_after(after = 20) {
		setTimeout(() => {
			this.t = 0;
			this.talk = true;
			this.wordsSpoken = 0;
		}, after);
	}

	set_shock_after(after = 20) {
		setTimeout(() =>
			this.img = 2, after);
	}

	quiet_after(after = 20) {
		setTimeout(() => {
			this.talk = false;
			this.img = 0;
		}, after);
	}

	// uneven to keep mouth open
	set_limit(words = 0) {
		this.limit = words;
		this.wordsSpoken = 0;
	}

	disappear_after(after = 20) {
		setTimeout(() => {
			this.widget.mesh.visible = false;
		}, after);
	}

	should_blink(so: boolean) {
		this.blink = so;
	}

	destroy() {
		this.widget.destroy();
	}

	make() {
		this.widget = new Widget({ x: 350, y: -200, z: 0, w: 200, h: 200 });
		this.widget.scale = 1.5;
	}

	update() {
		if (this.talk) {
			this.t += Four.delta;

			if (this.t > this.speed) {
				if (!this.limit || this.wordsSpoken < this.limit) {
					this.img = this.img < 2 ? this.img + 2 : 0;
					this.t = 0;
					this.wordsSpoken++;
				}
			}
		}
		else if (this.blink) {
			this.t += Four.delta;

			if (this.t > this.blinkDelay) {
				this.t = 0;
				this.blinkDelay = 2 + Math.random() * 2;
			}
			else if (this.t > 0.11) {
				this.img = 0;
			}
			else if (this.t > 0) {
				this.img = 1;
			}
		}

		this.widget.material.map = this.imgs[this.img];

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