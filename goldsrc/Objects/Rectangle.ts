import { Data2, Object2 } from "@app/exports";

import four from "../four";
import { default as THREE, Mesh, Vector3, ShaderMaterial, PlaneBufferGeometry, MeshPhongMaterial } from 'three';

import { Rectangles } from "@app/exports";

import Phong2 from "@app/Shaders/Phong2";

import Util from "@app/util";

interface Info {
	blur: string;
	shadow: string;
}

export class Rectangle extends Object2 {

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

	MakeRectangle(params: Info) {
		this.MakeMeshes(params);

		this.UpdatePosition();

		Rectangles.Show(this);
	}

	private MakeMeshes(info: Info) {

		this.geometry = new PlaneBufferGeometry(
			this.data.width, this.data.height, 1);

		this.material = Phong2.Make({
			map: Util.loadTexture(this.data.sty),
			blurMap: Util.loadTexture(info.blur),
			PINK: true,
			BLUR: true,
		});

		let materialShadow = Phong2.Make({
			map: Util.loadTexture(info.shadow),
			PINK: true,
			DARKEN: true
		});

		materialShadow.opacity = 0.25;
		materialShadow.color = new THREE.Color('black');

		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.mesh.frustumCulled = false;
		this.mesh.receiveShadow = true;

		this.meshShadow = new THREE.Mesh(this.geometry, materialShadow);
		this.meshShadow.frustumCulled = false;
	}

	Destroy() {
		super.Destroy();

		Rectangles.Hide(this);

		this.geometry.dispose();
		this.material.dispose();
	}

	Update() {
		super.Update();
	}

	UpdatePosition() {
		this.where.set(
			this.data.x * 64, this.data.y * 64, this.data.z! * 64);

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