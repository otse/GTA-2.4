import { Clock, Scene, WebGLRenderer, PerspectiveCamera, DirectionalLight, AmbientLight } from 'three';
import KILL from './KILL';
//export { THREE };
export var four;
(function (four) {
    four.delta = 0;
    function render() {
        four.delta = four.clock.getDelta();
        KILL.update();
        //if (Movie.enabled) {
        //	Movie.composer.render();
        //}
        //else {
        four.renderer.clear();
        four.renderer.render(four.scene, four.camera);
        //}
    }
    four.render = render;
    function init() {
        console.log('four init');
        four.clock = new Clock();
        four.camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 2000);
        four.camera.position.z = 200;
        four.scene = new Scene();
        four.directionalLight = new DirectionalLight(0x355886, 0.5);
        four.ambientLight = new AmbientLight('#355886'); // #5187cd
        four.scene.add(four.directionalLight);
        four.scene.add(four.ambientLight);
        four.renderer = new WebGLRenderer({ antialias: false });
        four.renderer.setPixelRatio(window.devicePixelRatio);
        four.renderer.setSize(window.innerWidth, window.innerHeight);
        four.renderer.autoClear = true;
        four.renderer.setClearColor(0x777777, 1);
        document.body.appendChild(four.renderer.domElement);
        window.addEventListener('resize', onWindowResize, false);
    }
    four.init = init;
    function onWindowResize() {
        four.camera.aspect = window.innerWidth / window.innerHeight;
        four.camera.updateProjectionMatrix();
        four.renderer.setSize(window.innerWidth, window.innerHeight);
    }
})(four || (four = {}));
export default four;
