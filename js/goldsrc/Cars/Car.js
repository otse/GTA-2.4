import Rectangle from "../Objects/Rectangle";
import { CarMetas } from "./Metas";
import CarPhysics from "./Every line is a physic";
export class Car extends Rectangle {
    constructor(data) {
        super(data);
        if (undefined == data.car)
            console.warn('Car data has no .car!');
        if (undefined == data.paint)
            data.paint = Math.floor(Math.random() * 35);
        console.log('Car ' + data.car + ' paint ', data.paint);
        this.lift = 1;
        const meta = CarMetas.getNullable(data.car);
        const physics = CarPhysics.getNullable(data.car);
        const model = physics.model_corrected || physics.model;
        if (meta.COLORLESS)
            data.sty = `sty/car/painted/GTA2_CAR_${model}.bmp`;
        else
            data.sty = `sty/car/painted/GTA2_CAR_${model}_PAL_${data.paint}.bmp`;
        data.width = meta.IMG_WIDTH;
        data.height = meta.IMG_HEIGHT;
        this.makeRectangle({
            blur: `sty/car/blurs/GTA2_CAR_${model}.png`,
            shadow: data.sty
        });
    }
}
export default Car;
