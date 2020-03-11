import Four from "../Four";
// "C API" LOL
export var Rectangles;
(function (Rectangles) {
    function init() {
    }
    Rectangles.init = init;
    function show(rectangle) {
        console.log('Rectangles add ' + rectangle.data.type);
        //Four.scene.add(rectangle.meshShadow);
        Four.scene.add(rectangle.mesh);
    }
    Rectangles.show = show;
    function hide(rectangle) {
        //Four.scene.remove(rectangle.meshShadow);
        Four.scene.remove(rectangle.mesh);
    }
    Rectangles.hide = hide;
})(Rectangles || (Rectangles = {}));
export default Rectangles;
