import Datas from "../Objects/Datas";
import StagingArea from "./Staging area";
import Cars from "../Cars/Cars";
import Sprites from "../Sprites/Sprites";
export var Generators;
(function (Generators) {
    Generators.roadMode = 'Normal';
    let Axis;
    (function (Axis) {
        Axis[Axis["Horz"] = 0] = "Horz";
        Axis[Axis["Vert"] = 1] = "Vert";
    })(Axis = Generators.Axis || (Generators.Axis = {}));
    function invert(data, axis, w) {
        let x = data.x;
        let y = data.y;
        data.x = axis ? y : x;
        data.y = axis ? x : y;
        data.r = axis;
        data.x += w[0];
        data.y += w[1];
    }
    Generators.invert = invert;
    function loop(min, max, func) {
        let x = min[0];
        for (; x <= max[0]; x++) {
            let y = min[1];
            for (; y <= max[1]; y++) {
                let z = min[2];
                for (; z <= max[2]; z++) {
                    func([x, y, z]);
                }
            }
        }
    }
    Generators.loop = loop;
    let Interiors;
    (function (Interiors) {
        function generate(min, max, style) {
            let staging = new StagingArea;
            const func = (p) => {
                if (p[0] > min[0] &&
                    p[0] < max[0] &&
                    p[1] > min[1] &&
                    p[1] < max[1]) { }
                else {
                    let wall = {
                        type: 'Wall',
                        style: style,
                        x: p[0],
                        y: p[1],
                        z: p[2]
                    };
                    wallFunc(wall, p, min, max);
                    staging.addData(wall);
                }
            };
            Generators.loop(min, max, func);
            staging.deliverKeep();
        }
        Interiors.generate = generate;
        const wallFunc = (data, p, min, max) => {
            if (p[0] == min[0] && p[1] == min[1]) { // lb
                data.wall = 'concave';
                data.r = 3;
            }
            else if (p[0] == max[0] && p[1] == max[1]) { // rt
                data.wall = 'concave';
                data.flip = true;
                data.r = 0;
            }
            else if (p[0] == min[0] && p[1] == max[1]) { // lt
                data.wall = 'concave';
                data.r = 0;
            }
            else if (p[0] == max[0] && p[1] == min[1]) { // rb
                data.wall = 'concave';
                data.r = 2;
            }
            else if (p[0] == min[0]) {
                data.wall = 'side';
                data.r = 3;
            }
            else if (p[1] == max[1]) {
                data.wall = 'side';
                data.flip = true;
                data.r = 0;
            }
            else if (p[0] == max[0]) {
                data.wall = 'side';
                data.r = 1;
            }
            else if (p[1] == min[1]) {
                data.wall = 'side';
                data.r = 2;
            }
        };
    })(Interiors = Generators.Interiors || (Generators.Interiors = {}));
    let Buildings;
    (function (Buildings) {
        Buildings.blueMetal = [
            'sty/metal/blue/340.bmp',
            'sty/metal/blue/340.bmp',
            'sty/metal/blue/340.bmp',
            'sty/metal/blue/340.bmp',
            'sty/metal/blue/340.bmp'
        ];
        const roofFunc = (block, p, min, max) => {
            if (p[2] == max[2]) {
                block.faces[4] = 'sty/roofs/green/793.bmp';
                if (p[0] == min[0] && p[1] == min[1]) { // lb
                    block.faces[4] = 'sty/roofs/green/784.bmp';
                    block.r = 3;
                }
                else if (p[0] == max[0] && p[1] == max[1]) { // rt
                    block.faces[4] = 'sty/roofs/green/784.bmp';
                    block.flip = true;
                    block.r = 0;
                }
                else if (p[0] == min[0] && p[1] == max[1]) { // lt
                    block.faces[4] = 'sty/roofs/green/784.bmp';
                    block.r = 0;
                }
                else if (p[0] == max[0] && p[1] == min[1]) { // rb
                    block.faces[4] = 'sty/roofs/green/784.bmp';
                    block.r = 2;
                }
                else if (p[0] == min[0]) {
                    block.faces[4] = 'sty/roofs/green/790.bmp';
                    block.r = 1;
                }
                else if (p[1] == max[1]) {
                    block.faces[4] = 'sty/roofs/green/790.bmp';
                    block.flip = true;
                    block.r = 2;
                }
                else if (p[0] == max[0]) {
                    block.faces[4] = 'sty/roofs/green/790.bmp';
                    block.r = 3;
                }
                else if (p[1] == min[1]) {
                    block.faces[4] = 'sty/roofs/green/790.bmp';
                    block.r = 0;
                }
            }
        };
        function type1(min, max) {
            const func = (p) => {
                let bmp = 'sty/metal/blue/340.bmp';
                let block = {
                    type: 'Block',
                    x: p[0],
                    y: p[1],
                    z: p[2]
                };
                block.faces = [];
                if (p[0] > min[0] &&
                    p[0] < max[0] &&
                    p[1] > min[1] &&
                    p[1] < max[1] &&
                    p[2] < max[2])
                    return;
                roofFunc(block, p, min, max);
                if (p[0] == min[0])
                    block.faces[1] = bmp;
                if (p[1] == max[1])
                    block.faces[2] = bmp;
                if (p[0] == max[0])
                    block.faces[0] = bmp;
                if (p[1] == min[1])
                    block.faces[3] = bmp;
                Datas.deliver(block);
            };
            Generators.loop(min, max, func);
        }
        Buildings.type1 = type1;
    })(Buildings = Generators.Buildings || (Generators.Buildings = {}));
    let Roads;
    (function (Roads) {
        function oneway(axis, w, segs, sheet) {
            let staging = new StagingArea;
            let seg = 0;
            for (; seg < segs; seg++) {
                let road = {
                    type: 'Surface',
                    sheet: sheet,
                    sprite: Sprites.ROADS.SINGLE,
                    x: w[0],
                    y: seg + w[1],
                    z: w[2],
                    r: 3
                };
                road.adapt_sheet = Generators.roadMode == 'Adapt';
                if (!seg || seg == segs - 1) {
                    road.sprite = Sprites.ROADS.SINGLE_OPEN;
                    if (!seg)
                        road.r += 1;
                    else if (seg == segs - 1)
                        road.r -= 1;
                }
                staging.addData(road);
            }
            if (axis == 0)
                staging.ccw(1);
            staging.deliverReplace();
        }
        Roads.oneway = oneway;
        function twolane(axis, w, segs, sheet) {
            let staging = new StagingArea;
            const lanes = 2;
            let seg = 0;
            for (; seg < segs; seg++) {
                let lane = 0;
                for (; lane < lanes; lane++) {
                    let road = {
                        type: 'Surface',
                        sheet: sheet,
                        sprite: Sprites.ROADS.SIDE_LINE,
                        x: seg + w[0],
                        y: lane + w[1],
                        z: 0,
                        r: !lane ? 2 : 0
                    };
                    if (!seg || seg == segs - 1) {
                        road.sprite = Sprites.ROADS.CONVEX_LINE;
                        road.adapt_sheet = Generators.roadMode == 'Adapt';
                        if (!seg && lane ||
                            seg == segs - 1 && !lane)
                            road.r += 1;
                    }
                    else if (lane == lanes - 1 && seg == 1 ||
                        !lane && seg == segs - 2) {
                        road.sprite = Sprites.ROADS.SIDE_STOP_LINE; // sideStopLine
                        road.flip = true;
                    }
                    staging.addData(road);
                }
            }
            if (axis == 1)
                staging.ccw(1);
            staging.deliverReplace();
        }
        Roads.twolane = twolane;
        function highway(axis, w, segs, lanes, sheet) {
            let staging = new StagingArea;
            let seg = 0;
            for (; seg < segs; seg++) {
                let lane = 0;
                for (; lane < lanes; lane++) {
                    let road = {
                        type: 'Surface',
                        sheet: sheet,
                        sprite: Sprites.ROADS.SIDE_LINE,
                        x: lane + w[0],
                        y: seg + w[1],
                        z: 0,
                        r: !lane ? 3 : 1
                    };
                    if (lane > 0 && lane < lanes - 1)
                        road.sprite = Sprites.ROADS.MIDDLE_TRACKS;
                    else if (!seg || seg == segs - 1) {
                        road.sprite = Sprites.ROADS.CONVEX_LINE;
                        if (!seg && !lane ||
                            seg == segs - 1 && lane)
                            road.r += 1;
                    }
                    /*else if (lane == lanes - 1 && seg == 1 ||
                        !lane && seg == segs - 2) {
                        road.square = 'sideStopLine';
                    }*/
                    staging.addData(road);
                }
            }
            if (axis == 0)
                staging.ccw(1);
            staging.deliverReplace();
        }
        Roads.highway = highway;
    })(Roads = Generators.Roads || (Generators.Roads = {}));
    let Parking;
    (function (Parking) {
        function onewayRight(w, segs, lanes, sheet) {
            let staging = new StagingArea;
            if (lanes < 2)
                console.warn('onewayRightVert less than 2 lanes');
            let seg = 0;
            for (; seg < segs; seg++) {
                let lane = 0;
                for (; lane < lanes; lane++) {
                    let road = {
                        type: 'Surface',
                        sheet: sheet,
                        sprite: Sprites.ROADS.SIDE_CLEAR,
                        x: lane + w[0],
                        y: seg + w[1],
                        z: w[2],
                        r: !lane ? 3 : 1
                    };
                    let parkedCar = {
                        type: 'Car',
                        carName: Cars.GetRandomName(),
                        x: road.x,
                        y: road.y,
                        z: road.z
                    };
                    let parkHere = false;
                    if (!seg || seg == segs - 1) {
                        if (!lane) {
                            road.sprite = Sprites.ROADS.SINGLE_OPEN;
                            road.adapt_sheet = Generators.roadMode == 'Adapt';
                            if (!seg)
                                road.r += 1;
                            else if (seg == segs - 1)
                                road.r -= 1;
                        }
                        else {
                            //road.square = 'sideLine';
                            //road.r = !seg ? 0 : 2;
                            continue; // Skip
                        }
                    }
                    else if (seg == 1 || seg == segs - 2) {
                        if (!lane) {
                            road.sprite = Sprites.ROADS.CUSTOM_NOTCH;
                            road.r = 1;
                            if (seg == 1)
                                road.flip = true;
                        }
                        else if (lane == lanes - 1) {
                            road.sprite = Sprites.ROADS.CORNER;
                            road.r = seg == 1 ? 0 : 3;
                            if (seg != 1) {
                                parkedCar.r = Math.PI / 4;
                                parkedCar.x = road.x + .5;
                                parkedCar.y = road.y - .11;
                                parkHere = true;
                            }
                        }
                        else {
                            road.r = seg == 1 ? 2 : 0;
                        }
                    }
                    else if (lane) {
                        if (lane == lanes - 1) {
                            road.sprite = Sprites.ROADS.PARKING_SPOT;
                            parkedCar.r = Math.PI / 4;
                            parkedCar.x = road.x + .5;
                            parkedCar.y = road.y - .11;
                            parkHere = true;
                        }
                        else
                            road.sprite = Sprites.ROADS.CLEAR;
                    }
                    if (parkHere && Math.random() < .75)
                        staging.addData(parkedCar);
                    staging.addData(road);
                }
            }
            staging.deliverReplace();
        }
        Parking.onewayRight = onewayRight;
        function leftBigHorz(w, segs, lanes, sheet) {
            let staging = new StagingArea;
            lanes = 4;
            let seg = 0;
            for (; seg < segs; seg++) {
                let lane = 0;
                for (; lane < lanes; lane++) {
                    let road = {
                        type: 'Surface',
                        sheet: sheet,
                        sprite: Sprites.ROADS.SIDE_LINE,
                        x: seg + w[0],
                        y: lane + w[1],
                        z: w[2],
                        r: 1
                    };
                    let parkedCar = {
                        type: 'Car',
                        carName: Cars.GetRandomName(),
                        x: road.x,
                        y: road.y,
                        z: road.z
                    };
                    let parkHere = false;
                    if (!seg) {
                        road.adapt_sheet = Generators.roadMode == 'Adapt';
                        if (lane == 1) {
                            road.sprite = Sprites.ROADS.CONVEX_LINE;
                            road.r += 1;
                        }
                        else if (lane == 2) {
                            road.sprite = Sprites.ROADS.CONVEX_LINE;
                        }
                        else {
                            continue;
                        }
                    }
                    else if (seg == 1) {
                        if (lane == 1) {
                            road.sprite = Sprites.ROADS.SIDE_LINE;
                            road.r += 1;
                        }
                        else if (lane == 2) {
                            road.sprite = Sprites.ROADS.SIDE_LINE;
                            road.r -= 1;
                        }
                        else {
                            continue;
                        }
                    }
                    else if (seg == 2) {
                        if (lane == 0) {
                            road.sprite = Sprites.ROADS.CORNER;
                            parkHere = true;
                            parkedCar.r = Math.PI / 4;
                            parkedCar.x = road.x + 0.5 + 0.6;
                            parkedCar.y = road.y + 0.5;
                        }
                        else if (lane == 1) {
                            road.sprite = Sprites.ROADS.CONVEX_LINE;
                            road.r += 2;
                        }
                        else if (lane == 2) {
                            road.sprite = Sprites.ROADS.CONVEX_LINE;
                            road.r -= 1;
                        }
                        else if (lane == 3) {
                            road.sprite = Sprites.ROADS.CORNER;
                            road.r += 1;
                            parkHere = true;
                            parkedCar.r = Math.PI - Math.PI / 4;
                            parkedCar.x = road.x + 0.5 + 0.6;
                            parkedCar.y = road.y + 0.5;
                        }
                    }
                    else if (seg == segs - 1) {
                        if (lane == 0) {
                            road.sprite = Sprites.ROADS.CORNER;
                            road.r -= 1;
                        }
                        else if (lane == 3) {
                            road.sprite = Sprites.ROADS.CORNER;
                            road.r += 2;
                        }
                        else {
                            road.sprite = Sprites.ROADS.SIDE_CLEAR;
                        }
                    }
                    else if (lane == 1 || lane == 2) {
                        road.sprite = Sprites.ROADS.CLEAR;
                    }
                    else if (lane != 1) {
                        road.sprite = Sprites.ROADS.PARKING_SPOT;
                        parkHere = true;
                        // Bottom
                        if (!lane) {
                            road.r += 1;
                            road.flip = true;
                            parkedCar.r = Math.PI / 4;
                            parkedCar.x = road.x + 0.5 + 0.6;
                            parkedCar.y = road.y + 0.5;
                        }
                        // Top
                        else {
                            road.r -= 1;
                            parkedCar.r = Math.PI - Math.PI / 4;
                            parkedCar.x = road.x + 0.5 + 0.6;
                            parkedCar.y = road.y + 0.5;
                        }
                    }
                    if (parkHere && Math.random() > .5)
                        staging.addData(parkedCar);
                    staging.addData(road);
                }
            }
            staging.deliverReplace();
        }
        Parking.leftBigHorz = leftBigHorz;
    })(Parking = Generators.Parking || (Generators.Parking = {}));
    let Fill;
    (function (Fill) {
        function fill1(min, object, extras = {}) {
            fill(min, min, object, extras);
        }
        Fill.fill1 = fill1;
        function fill(min, max, object, extras = {}) {
            let staging = new StagingArea;
            //const lanes = 1;
            let x = min[0];
            for (; x <= max[0]; x++) {
                let y = min[1];
                for (; y <= max[1]; y++) {
                    let pav = {
                        type: 'Surface',
                        x: x,
                        y: y,
                        z: min[2],
                    };
                    Object.assign(pav, object);
                    if (extras.WHEEL)
                        pav.r = Math.floor(Math.random() * 4);
                    staging.addData(pav);
                }
            }
            staging.deliverReplace();
        }
        Fill.fill = fill;
    })(Fill = Generators.Fill || (Generators.Fill = {}));
    let Pavements;
    (function (Pavements) {
        function fill(w, width, height) {
            //const lanes = 1;
            let x = 0;
            for (; x < width; x++) {
                let y = 0;
                for (; y < height; y++) {
                    let pav = {
                        type: 'Surface',
                        sheet: 'yellowyPavement',
                        sprite: Sprites.PAVEMENTS.MIDDLE,
                        //sty: 'sty/floors/blue/256.bmp',
                        x: x + w[0],
                        y: y + w[1],
                        z: w[2],
                    };
                    Datas.deliver(pav);
                }
            }
        }
        Pavements.fill = fill;
        function vert(x, y, z, segs, lanes) {
            //const lanes = 1;
            let seg = 0;
            for (; seg < segs; seg++) {
                let lane = 0;
                for (; lane < lanes; lane++) {
                    let pav = {
                        type: 'Surface',
                        sheet: 'yellowyPavement',
                        sprite: Sprites.PAVEMENTS.MIDDLE,
                        //sty: 'sty/floors/blue/256.bmp',
                        x: lane + x,
                        y: seg + y,
                        z: 0
                    };
                    Datas.deliver(pav);
                }
            }
        }
        Pavements.vert = vert;
        function Horz(x, y, z, segs, lanes) {
            //const lanes = 1;
            let seg = 0;
            for (; seg < segs; seg++) {
                let lane = 0;
                for (; lane < lanes; lane++) {
                    let pav = {
                        type: 'Surface',
                        sheet: 'yellowyPavement',
                        sprite: Sprites.PAVEMENTS.MIDDLE,
                        //sty: 'sty/floors/blue/256.bmp',
                        x: seg + y,
                        y: lane + x,
                        z: 0
                    };
                    Datas.deliver(pav);
                }
            }
        }
        Pavements.Horz = Horz;
    })(Pavements = Generators.Pavements || (Generators.Pavements = {}));
})(Generators || (Generators = {}));
export default Generators;