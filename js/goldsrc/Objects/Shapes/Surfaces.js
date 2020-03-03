import Four from "../../Renderer";
import { default as THREE } from 'three';
export var Surfaces;
(function (Surfaces) {
    function init() {
        this.geometry = new THREE.PlaneBufferGeometry(64, 64, 1, 1);
    }
    Surfaces.init = init;
    function show(plane) {
        Four.scene.add(plane.mesh);
    }
    Surfaces.show = show;
    function hide(plane) {
        Four.scene.remove(plane.mesh);
    }
    Surfaces.hide = hide;
})(Surfaces || (Surfaces = {}));
export default Surfaces;
