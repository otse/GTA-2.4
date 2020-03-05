import Datas from "../Objects/Datas";
import StagingArea from "./Staging area";
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
    let GenFlats;
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
                Datas.deliver(block);
            };
            Gen.loop(min, max, func);
        }
        GenFlats.Type1 = Type1;
    })(GenFlats = Gen.GenFlats || (Gen.GenFlats = {}));
    let GenRoads;
    (function (GenRoads) {
        function oneway(w, segs, sheet) {
            //console.log('oneway axis ', axis);
            let staging = new StagingArea;
            let datas;
            datas = twolane2(w, segs, sheet);
            staging.addDatas(datas);
            if (axis == 1)
                staging.ccw(1);
            staging.deliverAll();
        }
        GenRoads.oneway = oneway;
        function oneway2(w, segs, sheet) {
            let seg = 0;
            for (; seg < segs; seg++) {
                let road = {
                    type: 'Surface',
                    sheet: sheet,
                    square: 'single',
                    x: w[0],
                    y: seg + w[1],
                    z: w[2],
                    r: 3
                };
                if (!seg || seg == segs - 1) {
                    road.square = 'singleOpen';
                    if (!seg)
                        road.r += 1;
                    else if (seg == segs - 1)
                        road.r -= 1;
                }
                Datas.replaceDeliver(road);
            }
        }
        function twolane(axis, w, segs, sheet) {
            // Go 0 or 1
            console.log('twolane axis ', axis);
            let staging = new StagingArea;
            let datas;
            datas = twolane2(w, segs, sheet);
            staging.addDatas(datas);
            if (axis == 1)
                staging.ccw(1);
            staging.deliverAll();
        }
        GenRoads.twolane = twolane;
        function twolane2(w, segs, sheet) {
            let datas = [];
            const lanes = 2;
            let seg = 0;
            for (; seg < segs; seg++) {
                let lane = 0;
                for (; lane < lanes; lane++) {
                    let road = {
                        type: 'Surface',
                        sheet: sheet,
                        square: 'sideLine',
                        x: seg + w[0],
                        y: lane + w[1],
                        r: !lane ? 2 : 0
                    };
                    if (!seg || seg == segs - 1) {
                        road.square = 'convexLine';
                        if (!seg && lane ||
                            seg == segs - 1 && !lane)
                            road.r += 1;
                    }
                    else if (lane == lanes - 1 && seg == 1 ||
                        !lane && seg == segs - 2) {
                        road.square = 'sideStopLine'; // sideStopLine
                        road.f = true;
                    }
                    datas.push(road);
                    ///Datas.replaceDeliver(road);
                }
            }
            return datas;
        }
        function highway(axis, w, segs, lanes, sheet) {
            let staging = new StagingArea;
            let datas;
            datas = highway2(w, segs, lanes, sheet);
            staging.addDatas(datas);
            if (axis == 0)
                staging.ccw(1);
            staging.deliverAll();
        }
        GenRoads.highway = highway;
        function highway2(w, segs, lanes, sheet) {
            let datas = [];
            let seg = 0;
            for (; seg < segs; seg++) {
                let lane = 0;
                for (; lane < lanes; lane++) {
                    let road = {
                        type: 'Surface',
                        sheet: sheet,
                        square: 'sideLine',
                        x: lane + w[0],
                        y: seg + w[1],
                        r: !lane ? 3 : 1
                    };
                    if (lane > 0 && lane < lanes - 1)
                        road.square = 'middleTracks';
                    else if (!seg || seg == segs - 1) {
                        road.square = 'convexLine';
                        if (!seg && !lane ||
                            seg == segs - 1 && lane)
                            road.r += 1;
                    }
                    /*else if (lane == lanes - 1 && seg == 1 ||
                        !lane && seg == segs - 2) {
                        road.square = 'sideStopLine';
                    }*/
                    datas.push(road);
                    ///Datas.replaceDeliver(road);
                }
            }
            return datas;
        }
    })(GenRoads = Gen.GenRoads || (Gen.GenRoads = {}));
})(Gen || (Gen = {}));
export default Gen;
