// in 22 this separation was called the whatsit-thing;
// for 2.3 its renamed object-data
var ignoreData = { x: 0, y: 0, z: 0, r: 0, type: 'Ignore' };
export class Object2 {
    constructor(data) {
        // the Defaults
        if (!data.x)
            data.x = 0;
        if (!data.y)
            data.y = 0;
        if (!data.z)
            data.z = 0;
        if (!data.r)
            data.r = 0;
        if (!data.flip)
            data.flip = false;
        if (data.r > 3)
            data.r -= 4;
        if (data.r < 0)
            data.r += 4;
        this.broke = false;
        this.data = data;
    }
    destroy() {
        this.destroyed = true;
        this.data.object2 = null;
    }
    update() {
    }
}
export default Object2;
