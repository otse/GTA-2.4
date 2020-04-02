import Data2 from "../Objects/Data";
import Object2 from "../Objects/Object";
import Rectangles from "../Objects/Rectangles";

import Phong2 from "../Shaders/Phong2";

import Util from "../Random";

import Four from "../Four";
import { default as THREE, Mesh, Vector3, ShaderMaterial, PlaneBufferGeometry, MeshPhongMaterial, MeshBasicMaterial, NearestFilter, LinearFilter } from 'three';
import Objects from "./Objects";


interface Info {
	map: string;
	blur: string;
	shadow: string;
}

class Rectangle extends Object2 {

	mesh: Mesh
	meshShadow: Mesh

	material: ShaderMaterial | MeshPhongMaterial
	geometry: PlaneBufferGeometry

	raise = 2

	constructor(data: Data2) {
		super(data);

		// the Defaults
		if (!this.data.width) this.data.width = 20;
		if (!this.data.height) this.data.height = 20;
	}

	destroy() {
		super.destroy();

		Rectangles.hide(this);

		this.geometry.dispose();
		this.material.dispose();
	}

	make_rectangle(params: Info) {
		this.make_meshes(params);

		this.update_position();

		Rectangles.show(this);
	}

	private make_meshes(info: Info) {

		let map = Util.loadTexture(info.map);
		let blurMap = Util.loadTexture(info.blur);
		//blurMap.minFilter = LinearFilter;
		//blurMap.magFilter = LinearFilter;
		let shadowMap = Util.loadTexture(info.blur);

		this.geometry = new PlaneBufferGeometry(
			this.data.width, this.data.height, 1);

		this.material = Phong2.rectangleShader({
			name: 'Phong2',
			transparent: true,
			map: map,
			blending: THREE.NormalBlending
		}, {
			blurMap: blurMap
		});

		let materialShadow = Phong2.rectangleShadowShader({
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

	update() {
		super.update();

		Objects.relocate(this);
	}

	update_position() {
		let where = new Vector3(
			this.data.x * 64, this.data.y * 64, this.data.z * 64);

		this.mesh.position.copy(where);
		this.mesh.position.z += this.raise;
		this.meshShadow.position.copy(where);

		this.meshShadow.position.x += 3;
		this.meshShadow.position.y -= 3;
		
		this.mesh.rotation.z = this.data.r!;
		this.meshShadow.rotation.z = this.data.r!;
	}
}

export default Rectangle;