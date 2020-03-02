import { Data2, Object2, Chunks, Chunk, Points } from "@app/exports";
import KILL from "@app/KILL";

// aka data maker

export namespace Datas {
	type z = number;

	//export function Floor(data: Data2) {
	//	data.x = Math.floor(data.x);
	//	data.y = Math.floor(data.y);
	//}

	export function Big(data: Point): Point {
		let w = Points.Make(
			Math.floor(data.x / Chunks.tileSpan),
			Math.floor(data.y / Chunks.tileSpan)
		);

		return w;
	}

	export function GetChunk(data: Point): Chunk {
		let w = Big(data);

		let chunk = KILL.city.chunkList.Get(w);

		return chunk;
	}

	export function Deliver(data: Data2): void {
		let chunk = GetChunk(data);

		chunk.add(data);
	}

	export function ReplaceDeliver(A: Data2): void {
		let chunk = GetChunk(A);

		for (let B of chunk.datas) {
			if (B.type == 'Car')
				continue;
			if (
				A.x == B.x &&
				A.y == B.y &&
				A.z == B.z)

				chunk.remove(B);
		}

		chunk.add(A);
	}

	// for testing
	(window as any).Datas__ = Datas;
}

type x = number;

export default Datas;
