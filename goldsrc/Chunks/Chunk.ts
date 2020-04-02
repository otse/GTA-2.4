import { Group } from "three"

import Data2 from "../Objects/Data"
import Object2 from "../Objects/Object"
import Objects from "../Objects/Objects"

import Chunks from "./Chunks"
import Four from "../Four"
import Points from "../Objects/Points"

// A chunk makes / destroys its datas / objects

export class Chunk {

	static readonly _tileSpan = 7 // use Chunks.tileSpan

	isActive = false

	readonly datas: Data2[]
	readonly objects: Object2[]

	readonly group: THREE.Group

	readonly w: Point

	constructor(w: Point) {
		//console.log(`chunk`, Points.string(w));

		this.group = new Group;

		this.w = w;
		this.datas = [];
		this.objects = [];

		Chunks.scaffold(this);
	}

	private fabricate(data: Data2) {
		if (!data.object)
			Objects.makeNullable(data);
		if (data.object) {
			data.object.chunk = this;
			this.objects.push(data.object);
		}
	}

	_update() {
		for (let object of this.objects)
			object.update();
	}

	_add(data: Data2) {
		this.datas.push(data);
		if (this.isActive)
			this.fabricate(data);
	}

	_remove(data: Data2) {
		this.datas.splice(
			this.datas.indexOf(data), 1);
		this.objects.splice(
			this.objects.indexOf(data.object), 1);
		data.object.chunk = undefined;
	}

	unearth() {
		this.isActive = true;
		for (let data of this.datas)
			this.fabricate(data);
		Four.scene.add(this.group);
	}

	hide() {
		for (let object of this.objects)
			object.destroy();
		this.objects.length = 0; // Reset array
		this.isActive = false;
		Four.scene.remove(this.group);
	}
}

export default Chunk;