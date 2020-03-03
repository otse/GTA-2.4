import { default as THREE, Clock, Scene, WebGLRenderer, PerspectiveCamera, DirectionalLight, AmbientLight, BoxBufferGeometry } from 'three';

import KILL from './KILL';

//export { THREE };

export namespace Four {

	export var delta = 0;

	// todo, redo
	export var boxBufferGeometry: BoxBufferGeometry
	export var clock: Clock
	export var scene: Scene
	export var camera: PerspectiveCamera
	export var renderer: WebGLRenderer
	export var ambientLight: AmbientLight
	export var directionalLight: DirectionalLight

	export function update() {

		delta = clock.getDelta();

		KILL.update();

		//if (Movie.enabled) {
		//	Movie.composer.render();
		//}
		//else {
		renderer.clear();
		renderer.render(scene, camera);
		//}
	}

	export function init() {

		console.log('four init');

		clock = new Clock();

		camera = new PerspectiveCamera(
			70, window.innerWidth / window.innerHeight, 1, 2000);
		camera.position.z = 200;

		scene = new Scene();

		directionalLight = new DirectionalLight(0x355886, 0.5);

		ambientLight = new AmbientLight('#355886'); // #5187cd

		scene.add(directionalLight);
		scene.add(ambientLight);

		renderer = new WebGLRenderer({ antialias: false });
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(
			window.innerWidth, window.innerHeight);
		renderer.autoClear = true;
		renderer.setClearColor(0x777777, 1);

		document.body.appendChild(renderer.domElement);

		window.addEventListener('resize', onWindowResize, false);
	}

	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;

		camera.updateProjectionMatrix();

		renderer.setSize(
			window.innerWidth, window.innerHeight);
	}
}

window['Four'] = Four;

export default Four;