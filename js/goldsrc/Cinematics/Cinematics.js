import { Letterer } from "./Letterer";
export var Cinematics;
(function (Cinematics) {
    function init() {
        console.log('cinematics init');
    }
    Cinematics.init = init;
    function update() {
    }
    Cinematics.update = update;
    function missionText(words) {
        Letterer.makeNiceText(words);
    }
    Cinematics.missionText = missionText;
})(Cinematics || (Cinematics = {}));
;
export default Cinematics;
