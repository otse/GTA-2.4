import Four from "../Four";
// "C API" LOL
export var Rectangles;
(function (Rectangles) {
    function init() {
    }
    Rectangles.init = init;
    function show(rectangle) {
        console.log('Rectangles add ' + rectangle.data.type);
        Four.scene.add(rectangle.mesh);
        Four.scene.add(rectangle.meshShadow);
    }
    Rectangles.show = show;
    function hide(rectangle) {
        Four.scene.remove(rectangle.mesh);
        Four.scene.remove(rectangle.meshShadow);
    }
    Rectangles.hide = hide;
})(Rectangles || (Rectangles = {}));
export default Rectangles;
