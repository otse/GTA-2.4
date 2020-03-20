import { NearestFilter, ImageLoader, CanvasTexture } from "three";
import KILL from "../KILL";
import Spelling from "./Spelling";
export var Fonts;
(function (Fonts) {
    Fonts.fonts = {
        white: null,
        yellow: null,
        mission: null
    };
    function init() {
        Fonts.canvas = document.createElement('canvas');
        document.body.appendChild(Fonts.canvas);
        console.log('letterer init');
        const get_font = (name, rs, func) => {
            new ImageLoader().load(`sty/fonts/${name}.png`, (img) => {
                func(img);
                KILL.resourced(rs);
            }, () => { }, () => KILL.critical(rs));
        };
        get_font(`white`, `FONT_WHITE`, (e) => Fonts.fonts.white = e);
        get_font(`yellow`, `FONT_YELLOW`, (e) => Fonts.fonts.yellow = e);
        get_font(`mission`, `FONT_MISSION`, (e) => Fonts.fonts.mission = e);
    }
    Fonts.init = init;
    var spriteTextures = [];
    function textTexture(text) {
        let spelling = Spelling.build(text, 'small');
        let texture = new CanvasTexture(Fonts.canvas);
        texture.magFilter = NearestFilter;
        texture.minFilter = NearestFilter;
        const paint = () => {
            const context = Fonts.canvas.getContext("2d");
            Fonts.canvas.width = 512;
            Fonts.canvas.height = 128;
            for (let symbol of spelling.symbols) {
                let font = symbol.colorize ? Fonts.fonts.yellow : Fonts.fonts.white;
                context.drawImage(font, symbol.x2, symbol.y2, symbol.w, symbol.h, symbol.x, symbol.y, symbol.w, symbol.h);
            }
            let image = new Image();
            image.src = Fonts.canvas.toDataURL();
            texture.image = image;
            texture.needsUpdate = true;
        };
        paint();
        return texture;
    }
    Fonts.textTexture = textTexture;
})(Fonts || (Fonts = {}));
export default Fonts;
