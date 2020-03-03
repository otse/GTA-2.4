import { Clock, Scene, WebGLRenderer, PerspectiveCamera, DirectionalLight, AmbientLight } from 'three';
import KILL from './KILL';
//export { THREE };
export var Four;
(function (Four) {
    Four.delta = 0;
    function update() {
        Four.delta = Four.clock.getDelta();
        KILL.update();
        //if (Movie.enabled) {
        //	Movie.composer.render();
        //}
        //else {
        Four.renderer.clear();
        Four.renderer.render(Four.scene, Four.camera);
        //}
    }
    Four.update = update;
    function init() {
        console.log('four init');
        Four.clock = new Clock();
        Four.camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 2000);
        Four.camera.position.z = 200;
        Four.scene = new Scene();
        Four.directionalLight = new DirectionalLight(0x355886, 0.5);
        Four.ambientLight = new AmbientLight('#355886'); // #5187cd
        Four.scene.add(Four.directionalLight);
        Four.scene.add(Four.ambientLight);
        Four.renderer = new WebGLRenderer({ antialias: false });
        Four.renderer.setPixelRatio(window.devicePixelRatio);
        Four.renderer.setSize(window.innerWidth, window.innerHeight);
        Four.renderer.autoClear = true;
        Four.renderer.setClearColor(0x777777, 1);
        document.body.appendChild(Four.renderer.domElement);
        window.addEventListener('resize', onWindowResize, false);
    }
    Four.init = init;
    function onWindowResize() {
        Four.camera.aspect = window.innerWidth / window.innerHeight;
        Four.camera.updateProjectionMatrix();
        Four.renderer.setSize(window.innerWidth, window.innerHeight);
    }
})(Four || (Four = {}));
window['Four'] = Four;
export default Four;
