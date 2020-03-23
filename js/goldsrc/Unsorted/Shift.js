import Zoom from "./Zoom";
import Four from "../Four";
import { default as THREE, Vector2 } from "three";
const TWO = THREE;
export var Shift;
(function (Shift) {
    Shift.enabled = true;
    function cityView() {
        Zoom.set(2);
        Shift.effect.uniforms["pixelSize"].value = 1.0;
        Shift.effect.uniforms["zoom"].value = 0.0;
    }
    Shift.cityView = cityView;
    function cart(a, n) {
        if (a < Math.PI * 2)
            a += n * Four.delta;
        if (a > Math.PI * 2)
            a -= Math.PI * 2;
        return a;
    }
    let strawberry = 0;
    let orange = 0;
    let meat = 0;
    function update() {
        //updateHyper();
        //return;
        strawberry = cart(strawberry, 0.9);
        orange = cart(orange, 1.5);
        meat = cart(meat, 0.4);
        let x = Math.sin(strawberry);
        let y = Math.cos(orange) / 2;
        let z = Math.sin(meat) + 1 / 4;
        Shift.effect.uniforms['angle'].value = x * strawberry;
        Shift.effect.uniforms['redblue'].value = y * z * 0.0045;
    }
    Shift.update = update;
    let bat = 0;
    function updateHyper() {
        bat = cart(bat, 5);
        Shift.effect.uniforms['angle'].value = bat;
        Shift.effect.uniforms['redblue'].value = bat * 0.5;
    }
    Shift.updateHyper = updateHyper;
    function resize() {
        Shift.effect.uniforms["resolution"].value.set(window.innerWidth, window.innerHeight).multiplyScalar(window.devicePixelRatio);
    }
    Shift.resize = resize;
    function init() {
        Shift.composer = new TWO.EffectComposer(Four.renderer);
        Shift.renderPass = new TWO.RenderPass(Four.scene, Four.camera);
        Shift.composer.addPass(Shift.renderPass);
        Shift.effect = new TWO.ShaderPass(Shift.retroShader);
        Shift.effect.uniforms['redblue'].value = 0.0015 * 0.5;
        Shift.effect.uniforms["resolution"].value =
            new Vector2(window.innerWidth, window.innerHeight);
        Shift.effect.uniforms["resolution"].value.multiplyScalar(window.devicePixelRatio);
        Shift.effect.renderToScreen = true;
        Shift.composer.addPass(Shift.effect);
    }
    Shift.init = init;
    Shift.retroShader = {
        uniforms: {
            "tDiffuse": { value: null },
            "tDiffuse2": { value: null },
            "redblue": { value: 0.005 },
            "angle": { value: 0.0 },
            "resolution": { value: null },
            "pixelSize": { value: 3.0 },
            "zoom": { value: 1.0 }
        },
        defines: {
            'XXX': '',
        },
        vertexShader: `
			varying vec2 vUv;
			uniform float zoom;

			void main() {

				vUv = uv;

				//if (zoom > 0.0) {
				//    vUv.x -= zoom / 300.0;
				//}

				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			}`,
        fragmentShader: `
			uniform sampler2D tDiffuse;
			uniform sampler2D tDiffuse2;
			uniform float redblue;
			uniform float angle;


			varying vec2 vUv;

			vec4 siift(sampler2D texture) {
				vec2 offset = redblue * vec2( cos(angle), sin(angle));
				
				vec4 cr = texture2D(texture, vUv + offset);
				vec4 cga = texture2D(texture, vUv);
				vec4 cb = texture2D(texture, vUv - offset);

				return vec4(cr.r, cga.g, cb.b, cga.a);
			}

			void main() {

				
				vec4 a = siift(tDiffuse);
				vec4 b = siift(tDiffuse2);

				gl_FragColor = a + b;
			}`
    };
})(Shift || (Shift = {}));
