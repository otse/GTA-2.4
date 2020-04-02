import Data2 from "./Data";
import Points from "./Points";

import Chunk from "../Chunks/Chunk";
import Chunks from "../Chunks/Chunks";

import KILL from "../KILL";

// aka data maker

namespace Datas {
	type Z = number;

	export function big(data: Point): Point {
		let w = Points.floor2(
			data.x / Chunks.tileSpan,
			data.y / Chunks.tileSpan);

		return w;
	}

	export function getChunk(data: Point): Chunk {
		let w = big(data);

		let chunk = KILL.city.chunkList.getCreate(w);

		return chunk;
	}

	export function deliver(data: Data2): void {
		let chunk = getChunk(data);

		chunk._add(data);
	}

	export function replaceDeliver(A: Data2): void {
		let chunk = getChunk(A);

		let C;
		for (let B of chunk.datas) {
			if (B.type == 'Car')
				continue;
			if (
				A.x == B.x &&
				A.y == B.y &&
				A.z == B.z) {
				C = B;
				chunk._remove(B);
			}
		}

		if (C && C.sheet && A.adapt_sheet)
			A.sheet = C.sheet;

		chunk._add(A);
	}

	// for testing
	(window as any).Datas__ = Datas;
}

type x = number;

export default Datas;
