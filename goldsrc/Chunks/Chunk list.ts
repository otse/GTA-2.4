import Chunk from "./Chunk";


type Dict = { [index: string]: Chunk }

// Simple getters and chunk creation

class ChunkList {

	private dict: Dict = {}

	getNullable(w: Point): Chunk | null {
		let z = `${w.x} & ${w.y}`;

		let chunk = this.dict[z];

		return chunk || null;
	}

	get2(x: number, y: number): Chunk {
		return this.get({ x: x, y: y });
	}
	
	get(w: Point): Chunk {
		let z = `${w.x} & ${w.y}`;

		let chunk = this.dict[z];

		if (!chunk) {
			chunk = new Chunk(w);

			this.dict[z] = chunk;
		}

		return chunk;
	}

}

export default ChunkList;