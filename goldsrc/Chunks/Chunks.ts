import Chunk from "./Chunk";
import City from "./City";

import Points from "../Objects/Points";

import { Mesh, BoxGeometry, MeshBasicMaterial } from "three";

export namespace Chunks {

	export const tileSpan = 7
	export const actualSize = tileSpan * 64

	let geometry: THREE.BoxGeometry
	let blue: THREE.MeshBasicMaterial
	let purple: THREE.MeshBasicMaterial

	const N = 64 * tileSpan

	export function init() {

		geometry = new BoxGeometry(N, N, 0);

		blue = new MeshBasicMaterial(
			{ wireframe: true, color: 'blue' });

		purple = new MeshBasicMaterial(
			{ wireframe: true, color: 'purple' });
	}

	export function scaffold(chunk: Chunk) {
		let nany = chunk as any;

		nany.wireframe = new Mesh(geometry, purple);

		nany.wireframe.position.set(
			((chunk.w.x + 1) * N) - N / 2, ((chunk.w.y + 1) * N) - N / 2, 0);

		chunk.group.add(nany.wireframe);
	}

	// The Test
	export function vis(chunk: Chunk, p: Point) {
		const m = Math.ceil(City.spanUneven / 2);

		const d = Points.make(
			Math.abs(p.x - chunk.w.x),
			Math.abs(p.y - chunk.w.y));

		const outside = !(d.x > m || d.y > m);
		const wideSpan = d.x >= m || d.y >= m;
		const insideSpan = d.x <= m && d.y <= m;

		if ((chunk as any).wireframe)
			(chunk as any).wireframe.material =
				wideSpan ? purple : blue;

		return insideSpan;
	}
}

export default Chunks;