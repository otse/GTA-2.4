import { Group } from "three"

import Data2 from "../Objects/Data"
import Object2 from "../Objects/Object"
import Objects from "../Objects/Objects"

import Four from "../Renderer"

// A chunk makes / destroys its datas / objects

export class Chunk {

	static readonly _tileSpan = 7 // use Chunks.tileSpan

	currentlyActive = false

	readonly datas: Data2[]
	readonly objects: Object2[]

	readonly group: THREE.Group

	readonly w: Point

	constructor(w: Point) {
		//console.log(`chunk ${w.x} & ${w.y}`);

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

	fabricate(data: Data2) {
		let object = Objects.MakeNullable(data);

		if (!object)
			return;

		this.objects.push(object);
	}

	add(data: Data2) {
		this.datas.push(data);

		if (this.currentlyActive)
			this.fabricate(data);
	}

	remove(data: Data2) {
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

export default Chunk;