import Datas from "../objects/datas";
export var GenPlaza;
(function (GenPlaza) {
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
    GenPlaza.Fill = Fill;
})(GenPlaza || (GenPlaza = {}));
export default GenPlaza;
