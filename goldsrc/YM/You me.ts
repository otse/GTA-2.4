import { default as THREE, OrthographicCamera, CanvasTexture } from "three";
import Four from "../Four";

export class Thing {
    constructor() {

    }
}

export namespace YM {

    export let canvas;
    export let context;
    export let canvasTexture: CanvasTexture;

    export function init() {

        console.log('ym init');

        canvas = document.createElement('canvas');

        document.body.appendChild(canvas);

        context = canvas.getContext("2d");

        canvasTexture = new CanvasTexture(canvas);

        drawth(null);

        refresh();
    }

    export function resize() {

    }

    export function update() {

    }

    export function refresh() {
        //context.drawImage(
        //font, s.x2, s.y2, s.w, s.h, s.x, s.y, s.w, s.h);
        canvasTexture.needsUpdate = true;
    }
    
    export function drawth(th: Thing) {
        context.fillStyle = 'rgba(1, 0, 1, 1)'
        context.fillRect(0, 0, 100, 100);
        //context.drawImage(, s.x2, s.y2, s.w, s.h, s.x, s.y, s.w, s.h);
    }
}

export default YM;