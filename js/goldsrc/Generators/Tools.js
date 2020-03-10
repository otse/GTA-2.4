import Datas from "../Objects/Datas";
import Points from "../Objects/Points";
import Sprites from "../Sprites/Sprites";
export var GenTools;
(function (GenTools) {
    // To swap tile at ply in console
    // ~ Deline__.edit([Math.floor(ply.data.x), Math.floor(ply.data.y), 0], 'sideDash')
    function getDataOfType(w, type) {
        let point = { x: w[0], y: w[1], z: w[2] };
        let chunk = Datas.getChunk(point);
        for (let data of chunk.datas) {
            if (data.type != type)
                continue;
            if (Points.different(data, point))
                continue;
            return data;
        }
    }
    GenTools.getDataOfType = getDataOfType;
    function swap2(min, assign) {
        swap(min, min, assign);
    }
    GenTools.swap2 = swap2;
    function swap(min, max, assign) {
        let x = min[0];
        for (; x <= max[0]; x++) {
            let y = min[1];
            for (; y <= max[1]; y++) {
                let point = Points.make(x, y);
                let chunk = Datas.getChunk(point);
                for (let data of chunk.datas) {
                    if (Points.different(data, point))
                        continue;
                    //data.color = 'pink';
                    Object.assign(data, assign);
                    // Rebuild idiom
                    chunk.remove(data);
                    chunk.add(data);
                }
            }
        }
    }
    GenTools.swap = swap;
    let Deline;
    (function (Deline) {
        function simple(w, width, height) {
            let chunked = [];
            let x = 0;
            for (; x < width; x++) {
                let y = 0;
                for (; y < height; y++) {
                    let point = Points.make(w[0] + x, w[1] + y);
                    let chunk = Datas.getChunk(point);
                    for (let data of chunk.datas) {
                        if ('Surface' != data.type)
                            continue;
                        if (Points.different(data, point))
                            continue;
                        if (data.sprite == Sprites.ROADS.SIDE_LINE) {
                            data.sprite = Sprites.ROADS.SIDE_CLEAR;
                        }
                        if (data.sprite == Sprites.ROADS.CONVEX_LINE)
                            data.sprite = Sprites.ROADS.CONVEX;
                        if (data.sprite == Sprites.ROADS.SIDE_STOP_LINE) {
                            data.sprite = Sprites.ROADS.SIDE_STOP;
                        }
                    }
                }
            }
        }
        Deline.simple = simple;
        function aabb(min, max, axis) {
            horz(min, max[0] - min[0], max[1] - min[1], axis);
        }
        Deline.aabb = aabb;
        function horz(w, width, height, axis) {
            let chunked = [];
            let x = 0;
            for (; x < width; x++) {
                let y = 0;
                for (; y < height; y++) {
                    let p = { x: w[0] + x, y: w[1] + y };
                    let chunk = Datas.getChunk(p);
                    //if (chunked.includes(chunk))
                    //continue;
                    //chunked.push(chunk);
                    for (let data of chunk.datas) {
                        if ('Surface' != data.type)
                            continue;
                        if (Points.different(data, p))
                            continue;
                        //data.color = 'red';
                        if (data.sprite == Sprites.ROADS.SIDE_LINE) {
                            data.sprite = Sprites.ROADS.SIDE_CLEAR;
                            if (axis == 0) {
                                if (p.y == w[1] || p.y == w[1] + height - 1) {
                                    data.sprite = Sprites.ROADS.SIDE_DASH;
                                    //data.color = 'pink';
                                    if ((data.r == 1) && p.y == w[1] + height - 1)
                                        data.flip = true;
                                    if ((data.r == 3) && p.y == w[1])
                                        data.flip = true;
                                }
                            }
                        }
                        if (data.sprite == Sprites.ROADS.CONVEX_LINE)
                            data.sprite = Sprites.ROADS.CONVEX;
                        if (data.sprite == Sprites.ROADS.SIDE_STOP_LINE) {
                            data.sprite = Sprites.ROADS.SIDE_STOP;
                        }
                    }
                }
            }
        }
        Deline.horz = horz;
    })(Deline = GenTools.Deline || (GenTools.Deline = {}));
})(GenTools || (GenTools = {}));
export default GenTools;
