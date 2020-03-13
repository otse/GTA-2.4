import Points from "./Points";
import Chunks from "../Chunks/Chunks";
import KILL from "../KILL";
// aka data maker
var Datas;
(function (Datas) {
    //export function Floor(data: Data2) {
    //	data.x = Math.floor(data.x);
    //	data.y = Math.floor(data.y);
    //}
    function big(data) {
        let w = Points.floor2(data.x / Chunks.tileSpan, data.y / Chunks.tileSpan);
        return w;
    }
    Datas.big = big;
    function getChunk(data) {
        let w = big(data);
        let chunk = KILL.city.chunkList.get(w);
        return chunk;
    }
    Datas.getChunk = getChunk;
    function deliver(data) {
        let chunk = getChunk(data);
        chunk.add(data);
    }
    Datas.deliver = deliver;
    function replaceDeliver(A) {
        let chunk = getChunk(A);
        let C;
        for (let B of chunk.datas) {
            if (B.type == 'Car')
                continue;
            if (A.x == B.x &&
                A.y == B.y &&
                A.z == B.z) {
                C = B;
                chunk.remove(B);
            }
        }
        if (C && C.sheet && A.adapt_sheet)
            A.sheet = C.sheet;
        chunk.add(A);
    }
    Datas.replaceDeliver = replaceDeliver;
    // for testing
    window.Datas__ = Datas;
})(Datas || (Datas = {}));
export default Datas;
