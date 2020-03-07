interface Spritesheet {
    file: string
    padding?: number
    width: number
    height: number
    nr?: { w; h; }
    piece: { w; h; }
};

namespace Spritesheet {

	type List = Spritesheet['file']
    
}

export default Spritesheet;