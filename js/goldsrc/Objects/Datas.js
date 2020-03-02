import { Chunks, Points } from "@app/defs";
import KILL from "@app/KILL";
// aka data maker
export var Datas;
(function (Datas) {
    //export function Floor(data: Data2) {
    //	data.x = Math.floor(data.x);
    //	data.y = Math.floor(data.y);
    //}
    function Big(data) {
        let w = Points.Make(Math.floor(data.x / Chunks.tileSpan), Math.floor(data.y / Chunks.tileSpan));
        return w;
    }
    Datas.Big = Big;
    function GetChunk(data) {
        let w = Big(data);
        let chunk = KILL.city.chunkList.Get(w);
        return chunk;
    }
    Datas.GetChunk = GetChunk;
    function Deliver(data) {
        let chunk = GetChunk(data);
        chunk.add(data);
    }
    Datas.Deliver = Deliver;
    function ReplaceDeliver(A) {
        let chunk = GetChunk(A);
        for (let B of chunk.datas) {
            if (B.type == 'Car')
                continue;
            if (A.x == B.x &&
                A.y == B.y &&
                A.z == B.z)
                chunk.remove(B);
        }
        chunk.add(A);
    }
    Datas.ReplaceDeliver = ReplaceDeliver;
    // for testing
    window.Datas__ = Datas;
})(Datas || (Datas = {}));
export default Datas;
