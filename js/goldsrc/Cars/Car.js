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
        this.lift = 1;
        this.physics = EveryLineIsAPhysic.get(data.car);
        this.broke = !data.car || !this.physics;
        if (this.broke) {
            console.warn('this car object is broke');
            return;
        }
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
