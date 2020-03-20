import { Fonts } from "./Fonts";
export var Cinematics;
(function (Cinematics) {
    function init() {
        console.log('cinematics init');
    }
    Cinematics.init = init;
    function update() {
    }
    Cinematics.update = update;
    function test_missionText(words) {
        Fonts.textTexture(words);
    }
    Cinematics.test_missionText = test_missionText;
})(Cinematics || (Cinematics = {}));
;
export default Cinematics;
