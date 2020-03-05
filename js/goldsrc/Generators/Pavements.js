import Datas from "../Objects/Datas";
export var GenPavements;
(function (GenPavements) {
    function fill(w, width, height) {
        //const lanes = 1;
        let x = 0;
        for (; x < width; x++) {
            let y = 0;
            for (; y < height; y++) {
                let pav = {
                    type: 'Surface',
                    sheet: 'yellowyPavement',
                    square: 'middle',
                    //sty: 'sty/floors/blue/256.bmp',
                    x: x + w[0],
                    y: y + w[1],
                    z: w[2],
                };
                Datas.deliver(pav);
            }
        }
    }
    GenPavements.fill = fill;
    function vert(x, y, z, segs, lanes) {
        //const lanes = 1;
        let seg = 0;
        for (; seg < segs; seg++) {
            let lane = 0;
            for (; lane < lanes; lane++) {
                let pav = {
                    type: 'Surface',
                    sheet: 'yellowyPavement',
                    square: 'middle',
                    //sty: 'sty/floors/blue/256.bmp',
                    x: lane + x,
                    y: seg + y
                };
                Datas.deliver(pav);
            }
        }
    }
    GenPavements.vert = vert;
    function Horz(x, y, z, segs, lanes) {
        //const lanes = 1;
        let seg = 0;
        for (; seg < segs; seg++) {
            let lane = 0;
            for (; lane < lanes; lane++) {
                let pav = {
                    type: 'Surface',
                    sheet: 'yellowyPavement',
                    square: 'middle',
                    //sty: 'sty/floors/blue/256.bmp',
                    x: seg + y,
                    y: lane + x,
                };
                Datas.deliver(pav);
            }
        }
    }
    GenPavements.Horz = Horz;
})(GenPavements || (GenPavements = {}));
export default GenPavements;
