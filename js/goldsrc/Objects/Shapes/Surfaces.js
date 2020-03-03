import Four from "../../Renderer";
import { default as THREE } from 'three';
export var Surfaces;
(function (Surfaces) {
    function Init() {
        this.geometry = new THREE.PlaneBufferGeometry(64, 64, 1, 1);
    }
    Surfaces.Init = Init;
    function Show(plane) {
        Four.scene.add(plane.mesh);
    }
    Surfaces.Show = Show;
    function Hide(plane) {
        Four.scene.remove(plane.mesh);
    }
    Surfaces.Hide = Hide;
})(Surfaces || (Surfaces = {}));
export default Surfaces;
