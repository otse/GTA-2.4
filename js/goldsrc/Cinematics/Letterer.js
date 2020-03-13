import { NearestFilter, ImageLoader, CanvasTexture } from "three";
import KILL from "../KILL";
import Spelling from "./Spelling";
export var Letterer;
(function (Letterer) {
    function init() {
        Letterer.canvas = document.createElement('canvas');
        document.body.appendChild(Letterer.canvas);
        console.log('letterer init');
        //let manager = new LoadingManager();
        const error = () => {
            KILL.critical('FONT');
        };
        let loader = new ImageLoader();
        loader.load('sty/fonts/small.png', (image) => {
            Letterer.smallFont = image;
            KILL.resourced('SMALL_FONT');
        }, undefined, error);
        let loader2 = new ImageLoader();
        loader2.load('sty/fonts/big.png', (image) => {
            Letterer.bigFont = image;
            KILL.resourced('BIG_FONT');
        }, undefined, error);
    }
    Letterer.init = init;
    var spriteTextures = [];
    function makeNiceText(text) {
        let spelling = Spelling.build(text, 'small');
        let canvasTexture = new CanvasTexture(Letterer.canvas);
        const paint = () => {
            canvasTexture.magFilter = NearestFilter;
            canvasTexture.minFilter = NearestFilter;
            const context = Letterer.canvas.getContext("2d");
            Letterer.canvas.width = 512;
            Letterer.canvas.height = 128;
            for (let symbol of spelling.symbols) {
                context.drawImage(Letterer.smallFont, symbol.x2, symbol.y2, symbol.w, symbol.h, symbol.x, symbol.y, symbol.w, symbol.h);
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
export default Letterer;
