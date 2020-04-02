import Data2 from "./Data";
import Object2 from "./Object";

import Block from "./Shapes/Block";
import Surface from "./Shapes/Surface";
import Wall from "./Shapes/Wall";
import Car from "../Cars/Car";
import Datas from "./Datas";
import Ply from "../Pawns/Ply";
import Points from "./Points";

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
		console.warn('makeNullable', data.type);
		if (data.object2)
			console.warn('Data', data.type, 'has object2');
		let object = factory(data);
		if (!object)
			console.warn('Object2 not typable');
		return object || null;
	}

	export function relocate(obj: Object2) {
		let ch = Datas.getChunk(obj.data);
		if (ch != obj.chunk) {
			obj.chunk._remove(obj.data);
			ch._add(obj.data);
		}
	}
}

export default Objects;