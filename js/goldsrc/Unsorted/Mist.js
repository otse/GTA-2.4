import { MeshPhongMaterial, PlaneBufferGeometry, Mesh, RepeatWrapping } from "three";
import Four from "../Four";
import Util from "../Random";
import Chunks from "../Chunks/Chunks";
import Points from "../Objects/Points";
// http://kitfox.com/projects/perlinNoiseMaker/
var Mist;
(function (Mist) {
    let material;
    let geometry;
    let mesh;
    let x, y;
    function init() {
        Mist.mode = 'stormy';
        x = 0;
        y = 0;
        const w = 5;
        geometry = new PlaneBufferGeometry(Chunks.tileSpan * 64 * w, Chunks.tileSpan * 64 * w, 1, 1);
        let perlin = Util.loadTexture('sty/perlin_1.png');
        perlin.wrapS = RepeatWrapping;
        perlin.wrapT = RepeatWrapping;
        perlin.repeat.set(w, w);
        material = new MeshPhongMaterial({
            map: perlin,
            color: 0x93e5ff,
            transparent: true,
            opacity: .3,
            depthWrite: false
        });
        mesh = new Mesh(geometry, material);
        Four.scene.add(mesh);
    }
    Mist.init = init;
    function normalize(n) {
        if (n > 1)
            n -= 1;
        if (n < 0)
            n += 1;
        return n;
    }
    function update() {
        let w = Four.camera.position;
        let tiled = Points.floor2(w.x / 64, w.y / 64);
        let p = Points.region(tiled, Chunks.tileSpan);
        mesh.position.set(p.x * Chunks.actualSize, p.y * Chunks.actualSize, 5);
        if ('stormy' == Mist.mode) {
            x += Four.delta / 2;
            y += Four.delta / 6;
        }
        else {
            x += Four.delta / 18;
            y += Four.delta / 55;
        }
        x = normalize(x);
        y = normalize(y);
        material.map.offset.set(x, y);
    }
    Mist.update = update;
})(Mist || (Mist = {}));
export default Mist;