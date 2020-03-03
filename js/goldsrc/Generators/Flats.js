import Datas from "../Objects/Datas";
import Gen from "./Gen";
export var GenFlats;
(function (GenFlats) {
    GenFlats.blueMetal = [
        'sty/metal/blue/340.bmp',
        'sty/metal/blue/340.bmp',
        'sty/metal/blue/340.bmp',
        'sty/metal/blue/340.bmp',
        'sty/metal/blue/340.bmp'
    ];
    const roofFunc = (block, w, min, max) => {
        if (w[2] == max[2] - min[2] - 1) {
            block.faces[4] = 'sty/roofs/green/793.bmp';
            if (w[0] == min[0] && w[1] == min[1]) { // lb
                block.faces[4] = 'sty/roofs/green/784.bmp';
                block.r = 3;
            }
            else if (w[0] == min[0] + max[0] - 1 && w[1] == min[1] + max[1] - 1) { // rt
                block.faces[4] = 'sty/roofs/green/784.bmp';
                block.f = true;
                block.r = 0;
            }
            else if (w[0] == min[0] && w[1] == min[1] + max[1] - 1) { // lt
                block.faces[4] = 'sty/roofs/green/784.bmp';
                block.r = 0;
            }
            else if (w[0] == min[0] + max[0] - 1 && w[1] == min[1]) { // rb
                block.faces[4] = 'sty/roofs/green/784.bmp';
                block.r = 2;
            }
            else if (w[0] == min[0]) {
                block.faces[4] = 'sty/roofs/green/790.bmp';
                block.r = 1;
            }
            else if (w[1] == min[1] + max[1] - 1) {
                block.faces[4] = 'sty/roofs/green/790.bmp';
                block.f = true;
                block.r = 2;
            }
            else if (w[0] == min[0] + max[0] - 1) {
                block.faces[4] = 'sty/roofs/green/790.bmp';
                block.r = 3;
            }
            else if (w[1] == min[1]) {
                block.faces[4] = 'sty/roofs/green/790.bmp';
                block.r = 0;
            }
        }
    };
    function Type1(min, max) {
        const func = (w) => {
            let bmp = 'sty/metal/blue/340.bmp';
            let block = {
                type: 'Block',
                x: w[0],
                y: w[1],
                z: w[2]
            };
            block.faces = [];
            if (w[0] > min[0] &&
                w[0] < min[0] + max[0] - 1 &&
                w[1] > min[1] &&
                w[1] < min[1] + max[1] - 1 &&
                w[2] < min[2] + max[2] - 1)
                return;
            roofFunc(block, w, min, max);
            if (w[0] == min[0])
                block.faces[1] = bmp;
            if (w[1] == min[1] + max[1] - 1)
                block.faces[2] = bmp;
            if (w[0] == min[0] + max[0] - 1)
                block.faces[0] = bmp;
            if (w[1] == min[1])
                block.faces[3] = bmp;
            Datas.Deliver(block);
        };
        Gen.Generate(min, max, func);
    }
    GenFlats.Type1 = Type1;
})(GenFlats || (GenFlats = {}));
export default GenFlats;
