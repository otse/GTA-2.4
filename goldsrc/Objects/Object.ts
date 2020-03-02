import { Data2 } from "@app/exports";

// in 22 this separation was called the whatsit-thing;
// for 2.3 its renamed object-data

var ignoreData: Data2 = { x: 0, y: 0, type: 'Ignore' };

export class Object2 {
    data: Data2

    destroyed?: boolean

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
    }

    Destroy() {
        this.destroyed = true;
        this.data.object2 = null;
    }

    Update() {

    }
}

export default Object2;