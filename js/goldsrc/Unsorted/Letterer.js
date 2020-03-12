import { NearestFilter, ImageLoader, CanvasTexture } from "three";
import KILL from "../KILL";
export var Letterer;
(function (Letterer) {
    const alphabetPos = [
        0, 33, 65, 96, 127, 152, 180, 212, 244, 261, 291, 327, 354, 393, 425, 456, 487, 519, 550, 580, 608, 640, 672, 711, 744, 777
    ];
    function init() {
        Letterer.canvas = document.createElement('canvas');
        document.body.appendChild(Letterer.canvas);
        console.log('letterer init');
        let loader = new ImageLoader();
        loader.load('sty/fonts/big.png', (image) => {
            Letterer.bigFont = image;
            KILL.checkin(KILL.MASKS.FONTS);
        }, undefined, () => {
            console.error('kill can\'t load font');
        });
    }
    Letterer.init = init;
    var spriteTextures = [];
    function makeNiceText(words) {
        let canvasTexture = new CanvasTexture(Letterer.canvas);
        Letterer.paint = () => {
            console.log('called paint cb ');
            canvasTexture.magFilter = NearestFilter;
            canvasTexture.minFilter = NearestFilter;
            const context = Letterer.canvas.getContext("2d");
            Letterer.canvas.width = 512;
            Letterer.canvas.height = 512;
            for (let i = 0; i < words.length; i++) {
                let c = words[i];
                context.drawImage(Letterer.bigFont, 0, 0, 20, 20, 20, 20, 10, 10);
            }
            context.fillStyle = "blue";
            context.font = "bold 32px Arial";
            context.fillText(words, 0, 30);
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
