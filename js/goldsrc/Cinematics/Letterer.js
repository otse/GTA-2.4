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
        const load = (path, resource, func) => {
            let loader = new ImageLoader();
            let image;
            loader.load(path, (out) => {
                func(out);
                KILL.resourced(resource);
            }, undefined, () => KILL.critical(resource));
        };
        load('sty/fonts/small.png', 'SMALL_FONT', (image) => Letterer.smallWhite = image);
        load('sty/fonts/small_yellow.png', 'SMALL_FONT_YELLOW', (image) => Letterer.smallYellow = image);
        load('sty/fonts/big.png', 'BIG_FONT', (image) => Letterer.missionFont = image);
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
                context.drawImage(symbol.color ? Letterer.smallYellow : Letterer.smallWhite, symbol.x2, symbol.y2, symbol.w, symbol.h, symbol.x, symbol.y, symbol.w, symbol.h);
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
