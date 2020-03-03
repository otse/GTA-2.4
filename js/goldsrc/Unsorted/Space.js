import Chunks from "../Chunks/Chunks";
// uneven works well
const CELL_SPAN = 7;
// Coordination system for gta 22, 2.3
// x is left to right
// y is bottom to up
// Multiply by 64 to get gl space
//lol.Test
export var Space;
(function (Space) {
    // Aka Chunk-span
    function big(a) {
        return {
            x: Math.floor(a.x / Chunks.tileSpan),
            y: Math.floor(a.y / Chunks.tileSpan)
        };
    }
    Space.big = big;
    function add(a, b) {
        return { x: a.x + b.x, y: a.y + b.y };
    }
    Space.add = add;
    function dist(a, b) {
        const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
        return dx * dx + dy * dy; // + dz * dz;
    }
    Space.dist = dist;
    function fwdByAngle(object, dist, angle) {
        object.data.r = angle + Math.PI / 2;
        object.data.x += dist * Math.cos(angle);
        object.data.y += dist * Math.sin(angle);
    }
    Space.fwdByAngle = fwdByAngle;
})(Space || (Space = {}));
export default Space;
