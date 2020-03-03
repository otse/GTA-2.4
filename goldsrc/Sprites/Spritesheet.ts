interface Spritesheet {
    file: string
    squares: Readonly<object>
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