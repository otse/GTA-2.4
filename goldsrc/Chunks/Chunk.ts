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
		let object = Objects.makeNullable(data);
		if (object)
			this.objects.push(object);
	}

	_update() {
		for (let object of this.objects)
			object.update();
	}
	
	_add(data: Data2) {
		let i = this.datas.indexOf(data);
		if (i < 0)
			this.datas.push(data);
		if (this.isActive) {
			if (!data.object)
				this.fabricate(data);
			data.object.chunk = this;
			this.objects.push(data.object);
		}
	}

	_remove(data: Data2) {
		let i = this.datas.indexOf(data);
		if (i >= 0)
			this.datas.splice(i, 1);
		if (data.object) {
			i = this.objects.indexOf(data.object);
			if (i >= 0)
				this.objects.splice(i, 1);
			data.object.chunk = undefined;
		}
	}

	unearth() {
		console.log('unearth', Points.string(this.w));
		
		this.isActive = true;
		for (let data of this.datas)
			this.fabricate(data);
		Four.scene.add(this.group);
	}

	hide() {
		console.log('hide', Points.string(this.w));

		for (let object of this.objects)
			object.destroy();
		this.objects.length = 0; // Reset array
		this.isActive = false;
		Four.scene.remove(this.group);
	}
}

export default Chunk;