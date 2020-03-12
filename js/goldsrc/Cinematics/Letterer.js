import { NearestFilter, ImageLoader, CanvasTexture } from "three";
import KILL from "../KILL";
import Spelling from "./Spelling";
export var Letterer;
(function (Letterer) {
    const bigAlphabetPos = [
        0, 33, 65, 96, 127, 152, 180, 212, 244, 261, 291, 327, 354, 393, 425, 456, 487, 519, 550, 580, 608, 640, 672, 711, 744, 777, /* this is after z*/ 809,
        0, 22, 54, 85, 120, 150, 181, 211, 242, 274, 306, 323, 340, 371, 388, 405, 442, 459, 490, 507, 540, 562, 583
    ];
    function init() {
        Letterer.canvas = document.createElement('canvas');
        document.body.appendChild(Letterer.canvas);
        console.log('letterer init');
        let loader = new ImageLoader();
        loader.load('sty/fonts/big.png', (image) => {
            Letterer.bigFont = image;
            KILL.checkin('FONTS');
        }, undefined, () => {
            KILL.fault('BIG FONT');
        });
    }
    Letterer.init = init;
    var spriteTextures = [];
    function makeNiceText(text) {
        let spelling = Spelling.build(text, bigAlphabetPos);
        let canvasTexture = new CanvasTexture(Letterer.canvas);
        const paint = () => {
            canvasTexture.magFilter = NearestFilter;
            canvasTexture.minFilter = NearestFilter;
            const context = Letterer.canvas.getContext("2d");
            Letterer.canvas.width = 1024;
            Letterer.canvas.height = 256;
            for (let symbol of spelling.symbols) {
                context.drawImage(Letterer.bigFont, symbol.x2, symbol.y2, symbol.w, symbol.h, symbol.x, symbol.y, symbol.w, symbol.h);
            }
            let image = new Image();
            image.src = Letterer.canvas.toDataURL();
            canvasTexture.image = image;
            canvasTexture.needsUpdate = true;
        };
        paint();
        return canvasTexture;
    }
    Letterer.makeNiceText = makeNiceText;
})(Letterer || (Letterer = {}));
export default Sheets;
