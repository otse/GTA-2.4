export var Points;
(function (Points) {
    function Make(x, y) {
        return { x: x, y: y };
    }
    Points.Make = Make;
    function Copy(src) {
        return { x: src.x, y: src.y };
    }
    Points.Copy = Copy;
    function Same(a, b) {
        return !Different(a, b);
    }
    Points.Same = Same;
    function Different(a, b) {
        return a.x - b.x || a.y - b.y;
    }
    Points.Different = Different;
    function Floor(a) {
        return Make(Math.floor(a.x), Math.floor(a.y));
    }
    Points.Floor = Floor;
})(Points || (Points = {}));
export default Points;
