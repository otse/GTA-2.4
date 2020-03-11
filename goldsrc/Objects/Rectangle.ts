import Data2 from "../Objects/Data";
import Object2 from "../Objects/Object";
import Rectangles from "../Objects/Rectangles";

import Phong2 from "../Shaders/Phong2";

import Util from "../Random";

import Four from "../Four";
import { default as THREE, Mesh, Vector3, ShaderMaterial, PlaneBufferGeometry, MeshPhongMaterial, MeshBasicMaterial, NearestFilter, LinearFilter } from 'three';


interface Info {
	blur: string;
	shadow: string;
}

class Rectangle extends Object2 {

	mesh: Mesh
	meshShadow: Mesh

	material: ShaderMaterial | MeshPhongMaterial
	geometry: PlaneBufferGeometry

	where: THREE.Vector3

	lift = 2

	constructor(data: Data2) {
		super(data);

		// the Defaults
		if (!this.data.width) this.data.width = 20;
		if (!this.data.height) this.data.height = 20;

		this.where = new Vector3;

		//Ready(); // used by consumer class
	}

	makeRectangle(params: Info) {
		this.makeMeshes(params);

		this.updatePosition();

		Rectangles.show(this);
	}

	private makeMeshes(info: Info) {

		let map = Util.loadTexture(this.data.sty);
		let blurMap = Util.loadTexture(info.blur);
		//blurMap.minFilter = LinearFilter;
		//blurMap.magFilter = LinearFilter;
		let shadowMap = Util.loadTexture(info.blur);

		this.geometry = new PlaneBufferGeometry(
			this.data.width, this.data.height, 1);

		this.material = Phong2.makeRectangle({
			name: 'Phong2',
			transparent: true,
			map: map,
			blending: THREE.NormalBlending
		}, {
			blurMap: blurMap
		});

		let materialShadow = Phong2.makeRectangleShadow({
			name: 'Phong2 Shadow',
			transparent: true,
			map: blurMap,
		}, {
			
		});

		materialShadow.opacity = 0.25;
		materialShadow.color = new THREE.Color(0x0);

		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.mesh.frustumCulled = false;

		this.meshShadow = new THREE.Mesh(this.geometry, materialShadow);
		this.meshShadow.frustumCulled = false;
	}

	destroy() {
		super.destroy();

		Rectangles.hide(this);

		this.geometry.dispose();
		this.material.dispose();
	}

	update() {
		super.update();
	}

	updatePosition() {
		this.where.set(
			this.data.x * 64, this.data.y * 64, this.data.z * 64);

		this.mesh.position.copy(this.where);
		this.mesh.position.z += this.lift;

		// Shade
		this.meshShadow.position.copy(this.where);

		this.meshShadow.position.x += 3;
		this.meshShadow.position.y -= 3;
		
		this.mesh.rotation.z = this.data.r!;
		this.meshShadow.rotation.z = this.data.r!;
	}
}

export default Rectangle;