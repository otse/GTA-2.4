import Chunk from "./Chunk";
// Simple getters and chunk creation
export class ChunkList {
    constructor() {
        this.dict = {};
    }
    GetNullable(w) {
        let z = `${w.x} & ${w.y}`;
        let chunk = this.dict[z];
        return chunk || null;
    }
    Get2(x, y) {
        return this.Get({ x: x, y: y });
    }
    Get(w) {
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
