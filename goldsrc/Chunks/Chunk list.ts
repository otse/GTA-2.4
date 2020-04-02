import Chunk from "./Chunk";


type Dict = { [index: string]: Chunk }

// Simple getters and chunk creation

class ChunkList {

	private dict: Dict = {}

	key(w: Point): string {
		return `${w.x} & ${w.y}`;
	}

	getNullable(w: Point): Chunk | null {
		let z = this.key(w);

		let chunk = this.dict[z];

		return chunk || null;
	}

	get2(x: number, y: number): Chunk {
		return this.getCreate({ x: x, y: y });
	}
	
	getCreate(w: Point): Chunk {
		let z = this.key(w);

		let chunk = this.dict[z];

		if (!chunk) {
			chunk = new Chunk(w);

			this.dict[z] = chunk;
		}

		return chunk;
	}

}

export default ChunkList;