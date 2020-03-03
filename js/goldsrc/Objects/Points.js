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
    function copy(src) {
        return { x: src.x, y: src.y };
    }
    Points.copy = copy;
    function same(a, b) {
        return !different(a, b);
    }
    Points.same = same;
    function different(a, b) {
        return a.x - b.x || a.y - b.y;
    }
    Points.different = different;
    function floor(a) {
        return make(Math.floor(a.x), Math.floor(a.y));
    }
    Points.floor = floor;
})(Points || (Points = {}));
export default Points;
