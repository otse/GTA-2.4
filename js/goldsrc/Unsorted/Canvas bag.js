import { NearestFilter, CanvasTexture } from "three";
export var CanvasBag;
(function (CanvasBag) {
    function init() {
        CanvasBag.canvas = document.createElement('canvas');
        document.body.appendChild(CanvasBag.canvas);
        console.log('canvas bags init');
    }
    CanvasBag.init = init;
    var spriteTextures = [];
    function makeNiceText(words) {
        let canvasTexture = new CanvasTexture(CanvasBag.canvas);
        canvasTexture.magFilter = NearestFilter;
        canvasTexture.minFilter = NearestFilter;
        const context = CanvasBag.canvas.getContext("2d");
        CanvasBag.canvas.width = 512;
        CanvasBag.canvas.height = 512;
        context.fillStyle = "blue";
        //context.fillRect(0, 0, 512, 512);
        context.font = "bold 32px Arial";
        context.fillText(words, 0, 30);
        let image = new Image();
        image.src = CanvasBag.canvas.toDataURL();
        canvasTexture.image = image;
        canvasTexture.needsUpdate = true;
        return canvasTexture;
    }
    CanvasBag.makeNiceText = makeNiceText;
})(CanvasBag || (CanvasBag = {}));
export default Sheets;
