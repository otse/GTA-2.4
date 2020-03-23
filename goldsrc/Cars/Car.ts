import Rectangle from "../Objects/Rectangle";
import Data2 from "../Objects/Data";

import EveryLineIsAPhysic from "./Every line is a physic";
import Cars from "./Cars";

import KILL from "../KILL";

export class Car extends Rectangle {

	physics: EveryLineIsAPhysic.Interface;

	constructor(data: Data2) {
		super(data);

		Cars.add(this);

		if (undefined == data.car) data.car = 'Minx';
		if (undefined == data.spray) data.spray = KILL.floor_random(35);

		this.lift = 1;

		this.physics = EveryLineIsAPhysic.get(data.car as any);

		const model = this.physics.model_corrected || this.physics.model;

		if (this.physics.colorless)
			data.sty = `sty/car/unpainted/GTA2_CAR_${model}X.bmp`;

		else
			data.sty = `sty/car/painted/GTA2_CAR_${model}_PAL_${data.spray}.bmp`;

		data.width = this.physics.img_width;
		data.height = this.physics.img_height;

		this.makeRectangle({
			blur: `sty/car/blurs/GTA2_CAR_${model}.png`,
			shadow: data.sty
		});

	}

	destroy() {
		super.destroy();

		Cars.remove(this);
	}
}

export default Car;