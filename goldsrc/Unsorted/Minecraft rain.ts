import Util from "../Random";
import { MeshBasicMaterial, DoubleSide, Group, PlaneBufferGeometry, Mesh } from "three";
import Four from "../Four";
import Zoom from "./Zoom";

interface Drop {
	mesh: THREE.Mesh;
	rand: number;
	start: number;
}

export namespace Rain {

	export var what_a_rainy_day = true;

	export var drops: Drop[] = [];

	export var group: THREE.Group = null;

	export var basicmat;
	export var smat;
	export var geometry;

	/*export function smat_init() {

		let map = td.map(`sty/drop.png`);

		const params = {
			name: 'Rain Material',
			fog: false,

			//map: map,
			//color: 0x93e5ff,
			side: THREE.DoubleSide,
			transparent: true,
			opacity: .5,
			lights: false,
			depthTest: false, // false: rain falls through everything

			vertexShader: rain_vert,
			fragmentShader: THREE.ShaderChunk.meshbasic_frag
		};

		const o = Object.assign({
			uniforms: THREE.UniformsUtils.merge([
				THREE.ShaderLib['basic'].uniforms, {
					coords: { value: new THREE.Vector3(0, 0, 0) },
					descend: { value: 0 }
				}
			]),
			defines: { 'USE_MAP': '', 'DISTANCE': '' },
		}, params);

		smat = new THREE.ShaderMaterial(o);

		smat.map = map;

		smat.uniforms.map.value = map;
		smat.uniforms.diffuse.value = new THREE.Color(0x93e5ff);
		smat.uniforms.opacity.value = params.opacity;
	}*/

	/*export function smat_clone() {
		let mat = smat.clone();
		
		mat.uniforms.map.value = smat.map;
		mat.uniforms.coords.value = new THREE.Vector3(0, 0, 0);
		mat.uniforms.descend.value = 0;

		return mat;
	}*/

	export function init() {
		//smat_init();

		let map = Util.loadTexture(`sty/drop.png`);

		basicmat = new MeshBasicMaterial({
			map: map,
			color: 0x93e5ff,
			side: DoubleSide,
			transparent: true,
			opacity: .5,
			//lights: false,
			depthTest: false,
		});

		group = new Group();
		//group.rotation.y += Math.PI / 15;

		geometry = new PlaneBufferGeometry(4, 1, 1, 1);
		Util.UV.rotatePlane(geometry, 0, 3);

		Four.scene.add(group);
	}

	export const spread = 6;

	export function make_drop() {

		if (drops.length > 500)
			return;

		let mesh = new Mesh(geometry, basicmat);
		//mesh.matrixAutoUpdate = false;
		mesh.frustumCulled = false;

		const z = Four.camera.position.z;

		mesh.position.x = Four.camera.position.x + ((Math.random() - .5) * 64 * spread);
		mesh.position.y = Four.camera.position.y + ((Math.random() - .5) * 64 * spread);
		mesh.position.z = z;

		mesh.rotation.y = Math.PI / 2;

		//mesh.updateMatrix();

		let drop = {
			start: z,
			mesh: mesh,
			rand: Math.random()
		};
		drops.push(drop);

		group.add(mesh);
	}

	const HALF_FPS = true;
	const speed = HALF_FPS ? 7.0 : 3.5;

	let alternate = false;

	export function update() {

		if (!what_a_rainy_day)
			return;

		alternate = !alternate;

		if (HALF_FPS && alternate)
			return;
 
		make_drop();
		make_drop();
		make_drop();
		make_drop();
		make_drop();
		make_drop();
		make_drop();
		make_drop();
		make_drop();
		make_drop();

		let i = drops.length;

		while (i--) {
			let drop = drops[i];

			const fall = speed + drop.rand;
			drop.mesh.position.z -= fall;

			if (drop.start > drop.mesh.position.z + 300 || drop.mesh.position.z <= 0) {
				//drops.splice(i, 1);
				const z = Four.camera.position.z;
				drop.start = z;

				drop.mesh.position.x = Four.camera.position.x + ((Math.random() - .5) * 64 * spread);
				drop.mesh.position.y = Four.camera.position.y + ((Math.random() - .5) * 64 * spread);
				drop.mesh.position.z = z;
				//drop.mesh.updateMatrix();
				//group.remove(drop.mesh);
			}
		}

	}
}