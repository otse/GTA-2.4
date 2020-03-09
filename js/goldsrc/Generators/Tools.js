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
    function swap(w, assign) {
        let point = { x: w[0], y: w[1] };
        let chunk = Datas.getChunk(point);
        for (let data of chunk.datas) {
            if ('Surface' != data.type)
                continue;
            if (Points.different(data, point))
                continue;
            Object.assign(data, assign);
            console.log('Deline Swap complete');
            // Rebuild idiom
            chunk.remove(data);
            chunk.add(data);
            break;
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
                    let point = { x: w[0] + x, y: w[1] + y };
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
        function horz(w, width, height) {
            let chunked = [];
            let x = 0;
            for (; x < width; x++) {
                let y = 0;
                for (; y < height; y++) {
                    let point = { x: w[0] + x, y: w[1] + y };
                    let chunk = Datas.getChunk(point);
                    //if (chunked.includes(chunk))
                    //continue;
                    //chunked.push(chunk);
                    for (let data of chunk.datas) {
                        if ('Surface' != data.type)
                            continue;
                        if (Points.different(data, point))
                            continue;
                        if (data.sprite == Sprites.ROADS.SIDE_LINE) {
                            data.sprite = Sprites.ROADS.SIDE_CLEAR;
                            if (point.x == w[0] || point.x == w[0] + width - 1) {
                                data.sprite = Sprites.ROADS.SIDE_DASH;
                                if (point.x == w[0] + width - 1 && point.y == w[1])
                                    data.f = true;
                                if (point.x == w[0] && point.y == w[1] + height - 1)
                                    data.f = true;
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
