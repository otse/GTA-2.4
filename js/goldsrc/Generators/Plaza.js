import Datas from "../Objects/Datas";
export var GenPlaza;
(function (GenPlaza) {
    function fill(w, width, height, sty = 'sty/floors/blue/256.bmp') {
        //const lanes = 1;
        let x = 0;
        for (; x < width; x++) {
            let y = 0;
            for (; y < height; y++) {
                let pav = {
                    type: 'Surface',
                    //sheet: 'yellowyPavement',
                    //square: 'middle',
                    sty: sty,
                    x: x + w[0],
                    y: y + w[1],
                    z: w[2],
                };
                Datas.deliver(pav);
            }
        }
    }
    GenPlaza.fill = fill;
})(GenPlaza || (GenPlaza = {}));
export default GenPlaza;
