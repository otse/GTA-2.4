import Rectangle from "../Objects/Rectangle";
import Data2 from "../Objects/Data";

import EveryLineIsAPhysic from "./Every line is a physic";
import PaintJobs from "./Wang cars";
import Cars from "./Cars";
import Util from "../Random";

import { Texture } from "three";
import KILL from "../KILL";

export class Car extends Rectangle {

	physics: EveryLineIsAPhysic.Interface;

	constructor(data: Data2) {
		super(data);

		Cars.add(this);

		if (undefined == data.car) data.car = 'Minx';
		if (undefined == data.paint) data.paint = KILL.floorrandom(35);

		this.lift = 1;

		this.physics = EveryLineIsAPhysic.get(data.car as any);

		const model = this.physics.model_corrected || this.physics.model;

		if (this.physics.meta.colorless)
			data.sty = `sty/car/unpainted/GTA2_CAR_${model}X.bmp`;

		else
			data.sty = `sty/car/painted/GTA2_CAR_${model}_PAL_${data.paint}.bmp`;

		data.width = this.physics.meta.img_width;
		data.height = this.physics.meta.img_height;

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