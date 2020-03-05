export var Gen;
(function (Gen) {
    let Axis;
    (function (Axis) {
        Axis[Axis["Horz"] = 0] = "Horz";
        Axis[Axis["Vert"] = 1] = "Vert";
    })(Axis = Gen.Axis || (Gen.Axis = {}));
    function invert(data, axis, w) {
        let x = data.x;
        let y = data.y;
        data.x = axis ? y : x;
        data.y = axis ? x : y;
        data.r = axis;
        data.x += w[0];
        data.y += w[1];
    }
    Gen.invert = invert;
    function loop(min, max, func) {
        let x = 0;
        for (; x < max[0]; x++) {
            let y = 0;
            for (; y < max[1]; y++) {
                let z = 0;
                for (; z < max[2]; z++) {
                    func([min[0] + x, min[1] + y, min[2] + z]);
                }
            }
        }
    }
    Gen.loop = loop;
})(Gen || (Gen = {}));
export default Gen;
