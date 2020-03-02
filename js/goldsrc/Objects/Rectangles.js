import four from "../four";
// "C API" LOL
export var Rectangles;
(function (Rectangles) {
    function Init() {
    }
    Rectangles.Init = Init;
    function show(rectangle) {
        console.log('Rectangles Add ' + rectangle.data.type);
        four.scene.add(rectangle.mesh);
        four.scene.add(rectangle.meshShadow);
    }
    Rectangles.show = show;
    function hide(rectangle) {
        four.scene.remove(rectangle.mesh);
        four.scene.remove(rectangle.meshShadow);
    }
    Rectangles.hide = hide;
})(Rectangles || (Rectangles = {}));
export default Rectangles;
