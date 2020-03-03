import Chunk from "./Chunk";


type Dict = { [index: string]: Chunk }

// Simple getters and chunk creation

class ChunkList {

    private dict: Dict = {}

    constructor() {
        (window as any)['test'] = 1;
    }

    GetNullable(w: Point): Chunk | null {
        let z = `${w.x} & ${w.y}`;

        let chunk = this.dict[z];

        return chunk || null;
    }

    Get2(x: number, y: number): Chunk {
        return this.Get({ x: x, y: y });
    }
    
    Get(w: Point): Chunk {
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