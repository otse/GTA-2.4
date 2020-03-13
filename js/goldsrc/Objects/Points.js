export var Points;
(function (Points) {
    /*export interface Point {
        x: number;
        y: number;
    }*/
    function make(x, y) {
        return { x: x, y: y };
    }
    Points.make = make;
    function copy(a) {
        return { x: a.x, y: a.y };
    }
    Points.copy = copy;
    function floor(a) {
        return make(Math.floor(a.x), Math.floor(a.y));
    }
    Points.floor = floor;
    function floor2(x, y) {
        return make(Math.floor(x), Math.floor(y));
    }
    Points.floor2 = floor2;
    function different(a, b) {
        return a.x - b.x || a.y - b.y;
    }
    Points.different = different;
    function same(a, b) {
        return !different(a, b);
    }
    Points.same = same;
    function string(a) {
        return `${a.x},${a.y}`;
    }
    Points.string = string;
    function multp(a, n) {
        let b = copy(a);
        return make(b.x * n, b.y * n);
    }
    Points.multp = multp;
    function region(a, n) {
        return floor2(a.x / n, a.y / n);
    }
    Points.region = region;
    function dist(a, b) {
        const dx = a.x - b.x, dy = a.y - b.y;
        return dx * dx + dy * dy;
    }
    Points.dist = dist;
})(Points || (Points = {}));
export default Points;
