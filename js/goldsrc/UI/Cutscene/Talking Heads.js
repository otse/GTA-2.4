import Util from "../../Random";
import Four from "../../Four";
import Widget from "../Widget";
// Apparently a band
export class TalkingHead {
    constructor(name) {
        console.log('new talking head');
        this.talkTime = 0;
        this.blinkTime = 0;
        this.blinkDelay = 3;
        this.openEyesDelay = 0.1;
        this.img = 0;
        this.imgs = [];
        this.imgs.push(Util.loadTexture(`sty/talking heads/${name}_1.png`));
        this.imgs.push(Util.loadTexture(`sty/talking heads/${name}_2.png`));
        this.imgs.push(Util.loadTexture(`sty/talking heads/${name}_3.png`));
        this.animateMouth = true;
        //Sheets.center(`sty/talking heads/${name}_1.bmp`);
        this.make();
    }
    talk(aye, delay = 0) {
        if (aye)
            this.animateMouth = true;
        else
            setTimeout(() => {
                this.animateMouth = false;
                this.blinkTime = .11;
                this.blinkDelay = 3;
                this.widget.material.map = this.imgs[0];
            }, delay);
    }
    destroy() {
        this.widget.destroy();
    }
    make() {
        this.widget = new Widget({ x: 0, y: 0, z: 0, w: 64, h: 64 });
    }
    update() {
        if (this.animateMouth) {
            this.talkTime += Four.delta;
            if (this.talkTime > 0.2) {
                this.img = this.img < 2 ? this.img + 2 : 0;
                this.widget.material.map = this.imgs[this.img];
                this.talkTime = 0;
            }
        }
        else {
            this.blinkTime += Four.delta;
            if (this.blinkTime > this.blinkDelay) {
                this.blinkTime = 0;
                this.blinkDelay = 3 + Math.random() * 3;
            }
            else if (this.blinkTime > 0.11) {
                this.widget.material.map = this.imgs[0];
            }
            else if (this.blinkTime > 0) {
                this.widget.material.map = this.imgs[1];
            }
        }
        this.widget.update();
    }
}
;
window.TalkingHead = TalkingHead;
export default TalkingHead;
