import Chunk from "./Chunk"
import Chunks from "./Chunks"
import ChunkList from "./Chunk list"

import Datas from "../Objects/Datas"
import Points from "../Objects/Points"


export class City {

	static spanUneven = 5

	readonly chunkList: ChunkList
	readonly chunks: Chunk[]

	new: Point
	old: Point

	constructor() {
		this.chunks = [];
		
		this.chunkList = new ChunkList;

		this.new = Points.make(0, 0);
		this.old = Points.make(100, 100);
	}

	update(p: Point) {
		this.new = Datas.big(p);

		if (Points.same(this.new, this.old))
			return;
		
		console.log(`${this.old.x} & ${this.old.y} different to ${this.new.x} & ${this.new.y}`);

		this.old = Points.copy(this.new);

		this.off();
		this.on();

		for (let chunk of this.chunks) {
			chunk.update();
		}
	}

	// Find chunks outside the wide span
	// and turn them off with a negative for-loop
	off() {
		const to = this.new;

		let i = this.chunks.length;
		while (i--) {
			let ch = this.chunks[i];
			if (!Chunks.Vis(ch, to)) {
				this.chunks.splice(i, 1);
				ch.destroyRemove();
			}
		}

	}

	// Now turn on any new areas inside
	// the small span
	on() {
		const to = this.new;

		const m = Math.floor(City.spanUneven / 2);

		for (let y = 0; y < City.spanUneven; y++) {

			for (let x = 0; x < City.spanUneven; x++) {

				let z = Points.make(x - m + to.x, y - m + to.y);

				let ch = this.chunkList.getNullable(z);
				if (!ch)
					continue;

				if (!ch.currentlyActive) {
					this.chunks.push(ch);
					ch.makeAdd();
					Chunks.Vis(ch, to);
				}
			}
		}
	}

}

export default City;