import { NearestFilter, ImageLoader, CanvasTexture } from "three";
import KILL from "../KILL";
import Spelling from "./Spelling";
export var Letterer;
(function (Letterer) {
    const bigAlphabetPos = [
        0, 33, 65, 96, 127, 152, 180, 212, 244, 261, 291, 327, 354, 393, 425, 456, 487, 519, 550, 580, 608, 640, 672, 711, 744, 777, 809
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
            KILL.fault('FONTS');
        });
    }
    Letterer.init = init;
    var spriteTextures = [];
    function makeNiceText(text) {
        let spelling = Spelling.build(text, bigAlphabetPos);
        let canvasTexture = new CanvasTexture(Letterer.canvas);
        Letterer.paint = () => {
            canvasTexture.magFilter = NearestFilter;
            canvasTexture.minFilter = NearestFilter;
            const context = Letterer.canvas.getContext("2d");
            Letterer.canvas.width = 1024;
            Letterer.canvas.height = 1024;
            for (let symbol of spelling.symbols) {
                if (' ' == symbol.char)
                    continue;
                context.drawImage(Letterer.bigFont, symbol.cx, symbol.cy, symbol.w, symbol.h, symbol.x, symbol.y, symbol.w, symbol.h);
            }
            let image = new Image();
            image.src = Letterer.canvas.toDataURL();
            canvasTexture.image = image;
            canvasTexture.needsUpdate = true;
        };
        Letterer.paint();
        return canvasTexture;
    }
    Letterer.makeNiceText = makeNiceText;
})(Letterer || (Letterer = {}));
export default Sheets;
