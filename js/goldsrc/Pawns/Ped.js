import Rectangle from "../Objects/Rectangle";
import Peds from "./Peds";
import Util from "../Random";
import { pedDefs } from "./Anim defs";
import Anims from "../Sprites/Anims";
const idleSquare = { x: 1, y: 8 };
export class Ped extends Rectangle {
    constructor(data) {
        super(data);
        this.idle = true;
        this.run = false;
        this.move = true;
        this.timers = {};
        // Defaults
        if (!data.remap)
            data.remap = 15 + Math.floor(Math.random() * 53 - 15);
        data.height = data.width = 33;
        if (data.sty) {
        }
        data.sty = `sty/ped/template_${data.remap}.png`;
        // Todo, Avarage ped only uses two
        // maybe make a Get for this in Anims
        for (let property in pedDefs) {
            this.timers[property] =
                {
                    def: pedDefs[property],
                    i: 0,
                    timer: 0
                };
        }
        this.makeRectangle({
            blur: 'sty/ped/blur.png',
            shadow: data.sty
        });
        Anims.zero(this.timers.walk);
        Anims.zero(this.timers.run);
        Util.UV.fromSheet(this.geometry, idleSquare, Peds.sheet);
    }
    // kind of a hacky function
    Change(remap) {
        this.data.remap = remap;
        this.data.sty = `sty/ped/template_${this.data.remap}.png`;
        //this.material.map = three.LoadTexture(this.data.sty);
    }
    update() {
        super.update();
        if (this.move) {
            Peds.play(this, this.run ? 'run' : 'walk');
            this.idle = false;
        }
        else if (!this.idle) {
            Anims.zero(this.timers.walk);
            Anims.zero(this.timers.run);
            Util.UV.fromSheet(this.geometry, idleSquare, Peds.sheet);
            this.idle = true;
        }
        //this.Gravitate();
        this.updatePosition();
    }
}
export default Ped;
