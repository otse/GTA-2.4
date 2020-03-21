import { NearestFilter, ImageLoader, CanvasTexture } from "three";
import KILL from "../KILL";
import FontsSpelling from "./Fonts spelling";
export var Fonts;
(function (Fonts) {
    Fonts.fonts = {
        white: undefined,
        yellow: undefined,
        mission: undefined
    };
    function init() {
        Fonts.canvas = document.createElement('canvas');
        document.body.appendChild(Fonts.canvas);
        console.log('fonts init');
        load();
    }
    Fonts.init = init;
    function load() {
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
    function textTexture(text, width, height) {
        Fonts.canvas.width = width;
        Fonts.canvas.height = height;
        let symbols = FontsSpelling.symbolize(Fonts.canvas, text, 'small');
        let texture = new CanvasTexture(Fonts.canvas);
        texture.magFilter = NearestFilter;
        texture.minFilter = NearestFilter;
        const context = Fonts.canvas.getContext("2d");
        for (let s of symbols) {
            let font = s.colorize ? Fonts.fonts.yellow : Fonts.fonts.white;
            context.drawImage(font, s.x2, s.y2, s.w, s.h, s.x, s.y, s.w, s.h);
        }
        let image = new Image();
        image.src = Fonts.canvas.toDataURL();
        texture.image = image;
        texture.needsUpdate = true;
        return texture;
    }
    Fonts.textTexture = textTexture;
})(Fonts || (Fonts = {}));
export default Fonts;
