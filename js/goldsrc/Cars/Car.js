import Rectangle from "../Objects/Rectangle";
import EveryLineIsAPhysic from "./Every line is a physic";
import Cars from "./Cars";
export class Car extends Rectangle {
    constructor(data) {
        super(data);
        Cars.add(this);
        if (undefined == data.car)
            console.warn('Car data has no .car!');
        if (undefined == data.paint)
            data.paint = Math.floor(Math.random() * 35);
        //console.log('Car ' + data.car + ' paint ', data.paint);
        this.lift = 1;
        this.physics = EveryLineIsAPhysic.get(data.car);
        const model = this.physics.model_corrected || this.physics.model;
        //if (meta!.COLORLESS)
        //data.sty = `sty/car/unpainted/GTA2_CAR_${model}X.bmp`;
        //else
        data.sty = `sty/car/painted/GTA2_CAR_${model}_PAL_${data.paint}.bmp`;
        data.width = this.physics.meta.w;
        data.height = this.physics.meta.h;
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
