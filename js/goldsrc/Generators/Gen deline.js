import Datas from "../Objects/Datas";
import Points from "../Objects/Points";
export var GenDeline;
(function (GenDeline) {
    function Horz(w, width, height) {
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
                    if (data.square == 'sideLine') {
                        data.square = 'sideClear';
                        if (point.x == w[0] || point.x == w[0] + width - 1) {
                            data.square = 'sideDash';
                            if (point.x == w[0] + width - 1 && point.y == w[1])
                                data.f = true;
                            if (point.x == w[0] && point.y == w[1] + height - 1)
                                data.f = true;
                        }
                    }
                    if (data.square == 'convexLine')
                        data.square = 'convex';
                    if (data.square == 'sideStopLine') {
                        data.square = 'sideStop';
                    }
                }
            }
        }
    }
    GenDeline.Horz = Horz;
    function mixedToBad(w, width, height) {
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
                    if (Math.random() > .5)
                        continue;
                    if (data.sheet == 'mixedRoads' &&
                        data.square.indexOf('side') > -1) {
                        data.sheet = 'badRoads';
                        //if (Math.random() > .25)
                        //continue;
                        //if (data.square != 'sideDash')
                        //data.square = Math.random() > .5 ? 'sideDecal' : 'sideDecal_2';
                    }
                }
            }
        }
    }
    GenDeline.mixedToBad = mixedToBad;
    // To swap tile at ply in console
    // Deline__.Swap([Math.floor(ply.data.x), Math.floor(ply.data.y), 0], 'sideDash')
    function Edit(w, assign) {
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
    GenDeline.Edit = Edit;
    function EditMultiple(w, width, height, square_a, square_b) {
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
                    if (data.square == 'sideLine')
                        data.square = 'sideClear';
                    else if (data.square == 'sideStopLine')
                        data.square = 'sideStop';
                }
            }
        }
    }
    GenDeline.EditMultiple = EditMultiple;
    window.Deline__ = GenDeline;
})(GenDeline || (GenDeline = {}));
export default GenDeline;
