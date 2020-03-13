import City from "./City";
import Points from "../Objects/Points";
import { Mesh, BoxGeometry, MeshBasicMaterial } from "three";
export var Chunks;
(function (Chunks) {
    Chunks.tileSpan = 7;
    Chunks.actualSize = Chunks.tileSpan * 64;
    let geometry;
    let blue;
    let purple;
    const N = 64 * Chunks.tileSpan;
    function Init() {
        geometry = new BoxGeometry(N, N, 0);
        blue = new MeshBasicMaterial({ wireframe: true, color: 'blue' });
        purple = new MeshBasicMaterial({ wireframe: true, color: 'purple' });
    }
    Chunks.Init = Init;
    function Scaffold(chunk) {
        chunk.wireframe = new Mesh(geometry, purple);
        chunk.wireframe.position.set(((chunk.w.x + 1) * N) - N / 2, ((chunk.w.y + 1) * N) - N / 2, 0);
        chunk.group.add(chunk.wireframe);
    }
    Chunks.Scaffold = Scaffold;
    // This is the visibility test
    function Vis(chunk, p) {
        const m = Math.ceil(City.spanUneven / 2);
        const d = Points.make(Math.abs(p.x - chunk.w.x), Math.abs(p.y - chunk.w.y));
        const outside = !(d.x > m || d.y > m);
        const wideSpan = d.x >= m || d.y >= m;
        const insideSpan = d.x <= m && d.y <= m;
        if (chunk.wireframe)
            chunk.wireframe.material =
                wideSpan ? purple : blue;
        return insideSpan;
    }
    Chunks.Vis = Vis;
})(Chunks || (Chunks = {}));
export default Chunks;
