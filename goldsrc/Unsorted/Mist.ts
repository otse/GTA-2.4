import { default as THREE, Texture, MeshPhongMaterial, PlaneBufferGeometry, Mesh, MeshBasicMaterial, RepeatWrapping } from "three";
import Four from "../Four";
import Util from "../Random";
import Chunk from "../Chunks/Chunk";
import Chunks from "../Chunks/Chunks";
import Points from "../Objects/Points";

// http://kitfox.com/projects/perlinNoiseMaker/
namespace Mist {

	let enabled = false

	let material: MeshPhongMaterial
	let geometry: PlaneBufferGeometry
	let mesh: Mesh

	const HALF_FPS = true
	let alt = false

	export var mode: 'normal' | 'stormy';
	let x, y;

	export function init() {
		if (!enabled)
			return;

		mode = 'stormy';
		x = 0;
		y = 0;
		const w = 5;

		geometry = new PlaneBufferGeometry(Chunks.tileSpan * 64 * w, Chunks.tileSpan * 64 * w, 1, 1);

		let perlin = Util.loadTexture('sty/perlin_1.png')
		perlin.wrapS = RepeatWrapping;
		perlin.wrapT = RepeatWrapping;
		perlin.repeat.set(w, w);

		material = new MeshPhongMaterial({
			map: perlin,
			color: 0x777777,
			opacity: 0.15,
			transparent: true,
			depthWrite: false
		});

		mesh = new Mesh(geometry, material);

		Four.scene.add(mesh);
	}

	function normalize(n: number): number {
		if (n > 1)
			n -= 1;
		if (n < 0)
			n += 1;
		return n;
	}

	export function update() {

		if (!enabled)
			return;

		let delta = Four.delta;

		if (HALF_FPS) {
			delta *= 2;
			alt = !alt;
			if (!alt)
				return;
		}

		let w = Four.camera.position;

		let tiled = Points.floor2(w.x / 64, w.y / 64);

		let p = Points.region(tiled, Chunks.tileSpan);

		mesh.position.set(p.x * Chunks.actualSize, p.y * Chunks.actualSize, 5);

		if ('stormy' == mode) {
			x += delta / 2;
			y += delta / 6;
		}
		else {
			x += delta / 18;
			y += delta / 55;
		}
		x = normalize(x);
		y = normalize(y);

		material.map.offset.set(x, y);
	}

}

export default Mist;