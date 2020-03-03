import Four from "../Renderer";
export var Anims;
(function (Anims) {
    function zero(a) {
        a.timer = 0;
        a.i = 0;
    }
    Anims.zero = zero;
    function update(a) {
        a.timer += Four.delta;
        if (a.timer < a.def.moment)
            return;
        const end = a.i + 1 == a.def.frames;
        !end ? a.i++ : a.i = 0;
        a.timer = 0;
    }
    Anims.update = update;
})(Anims || (Anims = {}));
export default Anims;
