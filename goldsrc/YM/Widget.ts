import Data2 from "../Objects/Data";
import Datas from "../Objects/Datas";

import { MeshBasicMaterial, PlaneBufferGeometry, Mesh, Texture, Color } from "three";

import Four from "../Four";
import Util from "../Random";

// we use canvas now tho

export class Widget {

	pos: {
		x; y; z;
		w; h;
	}

	scale = 1

	mesh: Mesh
	texture: Texture
	material: MeshBasicMaterial
	geometry: PlaneBufferGeometry

	constructor(pos: Widget['pos']) {
		console.log('ui element');

		this.pos = pos;

		this.make();
	}

	destroy() {
		this.geometry.dispose();
		this.material.dispose();
	}

	toggle(see: boolean = false) {
		this.mesh.visible = see;
	}

	make() {
		this.material = new MeshBasicMaterial({
			map: Util.loadTexture(`sty/a square.png`),
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

		// x / y range to -500 to 500
		let x = cam.x + this.pos.x;// * Four.aspect;
		let y = cam.y + this.pos.y;// * Four.aspect;
		let z = cam.z + this.pos.z - 680; // magic number

		const scale = this.scale;///Four.aspect;

		this.mesh.position.set(x, y, z);
		this.mesh.scale.set(scale, scale, scale);
	}

};

(window as any).Widget = Widget;

export default Widget;