import { Group } from "three";
import Objects from "../Objects/Objects";
import Four from "../Four";
// A chunk makes / destroys its datas / objects
export class Chunk {
    constructor(w) {
        //console.log(`chunk ${w.x} & ${w.y}`);
        this.currentlyActive = false;
        this.group = new Group;
        this.w = w;
        this.datas = [];
        this.objects = [];
        //Chunks.Scaffold(this);
    }
    update() {
        for (let object of this.objects)
            object.update();
    }
    fabricate(data) {
        let object = Objects.makeNullable(data);
        if (!object)
            return;
        this.objects.push(object);
    }
    add(data) {
        this.datas.push(data);
        if (this.currentlyActive) {
            this.fabricate(data);
            console.warn('active add');
        }
    }
    remove(data) {
        this.datas.splice(this.datas.indexOf(data), 1);
        let object = data.object2;
        if (!object)
            return;
        object.destroy();
        this.objects.splice(this.objects.indexOf(object), 1);
    }
    makeAdd() {
        //console.log('Chunk make n add');
        for (let data of this.datas)
            this.fabricate(data);
        this.currentlyActive = true;
        Four.scene.add(this.group);
    }
    destroyRemove() {
        //console.log('Chunk destroy n remove');
        for (let object of this.objects)
            object.destroy();
        this.objects.length = 0; // Reset array
        this.currentlyActive = false;
        Four.scene.remove(this.group);
    }
}
Chunk._tileSpan = 7; // use Chunks.tileSpan
export default Chunk;
