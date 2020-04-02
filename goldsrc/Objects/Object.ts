import Data2 from "./Data";
import Chunk from "../Chunks/Chunk";
import Datas from "./Datas";

// in 22 this separation was called the whatsit-thing;
// for 2.3 its renamed object-data

var ignoreData: Data2 = { x: 0, y: 0, z: 0, r: 0, type: 'Ignore' };

export class Object2 {
	data: Data2

	chunk: Chunk
	
	constructor(data: Data2) {
		// the Defaults
		if (!data.x) data.x = 0;
		if (!data.y) data.y = 0;
		if (!data.z) data.z = 0;
		if (!data.r) data.r = 0;
		if (!data.f) data.f = false;
		if (data.r > 3) data.r -= 4;
		if (data.r < 0) data.r += 4;

		this.data = data;

		data.object = this;
	}

	destroy() {
		this.data.object = null;
	}

	update() {
		//console.log('update', this.data.type);
	}
}

export default Object2;