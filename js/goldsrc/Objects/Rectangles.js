import four from "../four";
// "C API" LOL
export var Rectangles;
(function (Rectangles) {
    function Init() {
    }
    Rectangles.Init = Init;
    function Show(rectangle) {
        console.log('Rectangles Add ' + rectangle.data.type);
        four.scene.add(rectangle.mesh);
        four.scene.add(rectangle.meshShadow);
    }
    Rectangles.Show = Show;
    function Hide(rectangle) {
        four.scene.remove(rectangle.mesh);
        four.scene.remove(rectangle.meshShadow);
    }
    Rectangles.Hide = Hide;
})(Rectangles || (Rectangles = {}));
export default Rectangles;
