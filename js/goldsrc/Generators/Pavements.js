import Datas from "../objects/datas";
export var GenPavements;
(function (GenPavements) {
    function Fill(w, width, height) {
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
                Datas.Deliver(pav);
            }
        }
    }
    GenPavements.Fill = Fill;
    function Vert(x, y, z, segs, lanes) {
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
                Datas.Deliver(pav);
            }
        }
    }
    GenPavements.Vert = Vert;
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
                Datas.Deliver(pav);
            }
        }
    }
    GenPavements.Horz = Horz;
})(GenPavements || (GenPavements = {}));
export default GenPavements;
