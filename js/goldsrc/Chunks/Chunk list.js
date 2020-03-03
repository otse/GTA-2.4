import Chunk from "./Chunk";
// Simple getters and chunk creation
class ChunkList {
    constructor() {
        this.dict = {};
    }
    getNullable(w) {
        let z = `${w.x} & ${w.y}`;
        let chunk = this.dict[z];
        return chunk || null;
    }
    get2(x, y) {
        return this.get({ x: x, y: y });
    }
    get(w) {
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
