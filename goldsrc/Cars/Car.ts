import Rectangle from "../Objects/Rectangle";
import Data2 from "../Objects/Data";

import { CarMetas } from "./Metas";
import CarPhysics from "./Every line is a physic";
import PaintJobs from "./Paints";

export class Car extends Rectangle {
	constructor(data: Data2) {
		super(data);

		if (undefined == data.car)
			console.warn('Car data has no .car!');

		if (undefined == data.paint)
			data.paint = Math.floor(Math.random() * 35);

		//console.log('Car ' + data.car + ' paint ', data.paint);

		this.lift = 1;

		const meta = CarMetas.getNullable(data.car!);

		const physics = CarPhysics.getNullable(data.car!);

		const model = physics!.model_corrected || physics!.model;

		if (meta!.COLORLESS)
			data.sty = `sty/car/unpainted/GTA2_CAR_${model}X.bmp`;
		else
			data.sty = `sty/car/painted/GTA2_CAR_${model}_PAL_${data.paint}.bmp`;

		data.width = meta!.IMG_WIDTH;
		data.height = meta!.IMG_HEIGHT;

		this.makeRectangle({
			blur: `sty/car/blurs/GTA2_CAR_${model}.png`,
			shadow: data.sty
		});

	}
}

export default Car;