import Data2 from "./Data";
import Object2 from "./Object";

import Block from "./Shapes/Block";
import Surface from "./Shapes/Surface";
import Wall from "./Shapes/Wall";
import Car from "../Cars/Car";
import Datas from "./Datas";
import Ply from "../Pawns/Ply";

export namespace Objects {
	function factory(data: Data2): Object2 | null {

		switch (data.type) {
			//case 'Ped': return new Ped(data);
			case 'Ply': return new Ply(data);

			case 'Car': return new Car(data);
			case 'Block': return new Block(data);
			case 'Surface': return new Surface(data);
			case 'Wall': return new Wall(data);
			//case 'Lamp': return new Lamp(data);

			default:
				return null;
		}
	}

	export function makeNullable(data: Data2): Object2 | null {
		if (data.object)
			console.warn('Data', data.type, 'has object2');
		let object = factory(data);
		if (!object)
			console.warn('Object2 not typable');
		return object || null;
	}

	export function relocate(object: Object2) {
		let ch = Datas.getChunk(object.data);
		if (ch != object.chunk) {
			if (object.chunk)
				object.chunk._remove(object.data);
			ch._add(object.data);
			console.log("relocating", object.data.type);
		}
	}
}

export default Objects;