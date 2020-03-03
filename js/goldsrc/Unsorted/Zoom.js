import KILL from "../KILL";
import Four from "../Renderer";
import EasingFunctions from "./Easing";
import App from "../Appp";
// todo construct a utility type from the length of the stages array,
// so that we can make a cool tuple for the Zoom.Set so that we dont
// have to write 0 | 1 | 2 | 3
// http://www.typescriptlang.org/docs/handbook/advanced-types.html
var Zoom;
(function (Zoom) {
    Zoom.stage = 2;
    Zoom.stages = [150, 300, 600, 1200];
    let broom = 600;
    let zoom = 600;
    let t = 0;
    const SECONDS = 1;
    function set(st) {
        t = 0;
        broom = zoom;
        Zoom.stage = st;
    }
    Zoom.set = set;
    function update() {
        if (!KILL.ply)
            return;
        const z = App.map[90] == 1;
        if (z) {
            t = 0;
            broom = zoom;
            Zoom.stage =
                Zoom.stage < Zoom.stages.length - 1 ? Zoom.stage + 1 : 0;
        }
        t += Four.delta / SECONDS;
        t = Math.min(Math.max(t, 0.0), 1.0);
        const difference = Zoom.stages[Zoom.stage] - broom;
        const T = EasingFunctions.inOutCubic(t);
        zoom = broom + (T * difference);
        const data = KILL.ply.data;
        Four.camera.position.set(data.x * 64, data.y * 64, zoom);
    }
    Zoom.update = update;
})(Zoom || (Zoom = {}));
export default Zoom;
