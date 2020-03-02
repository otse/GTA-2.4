import { Objects } from "@app/exports";
import { Group } from "three";
import four from "@app/four";
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
    Update() {
        for (let object of this.objects)
            object.Update();
    }
    Fabricate(data) {
        let object = Objects.MakeNullable(data);
        if (!object)
            return;
        this.objects.push(object);
    }
    Add(data) {
        this.datas.push(data);
        if (this.currentlyActive)
            this.Fabricate(data);
    }
    Remove(data) {
        this.datas.splice(this.datas.indexOf(data), 1);
        let object = data.object2;
        if (!object)
            return;
        object.Destroy();
        this.objects.splice(this.objects.indexOf(object), 1);
    }
    MakeAdd() {
        //console.log('Chunk make n add');
        for (let data of this.datas)
            this.Fabricate(data);
        this.currentlyActive = true;
        four.scene.add(this.group);
    }
    DestroyRemove() {
        //console.log('Chunk destroy n remove');
        for (let object of this.objects)
            object.Destroy();
        this.objects.length = 0; // Reset array
        this.currentlyActive = false;
        four.scene.remove(this.group);
    }
}
Chunk._tileSpan = 7; // use Chunks.tileSpan
export default Chunk;
