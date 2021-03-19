import Cameraz from "./Cameraz";
import Four from "../Four";

import { default as THREE, Vector2 } from "three";

const TWO = (THREE as any)

export namespace Shift {
	export var enabled = true;

	export var composer;
	export var effect;
	export var renderPass;

	export function cityView() {
		Cameraz.set(2);
		Shift.effect.uniforms["pixelSize"].value = 1.0;
		Shift.effect.uniforms["zoom"].value = 0.0;
	}

	function cart(a: number, n: number) {
		if (a < Math.PI * 2)
			a += n * Four.delta;
		if (a > Math.PI * 2)
			a -= Math.PI * 2;
		return a;
	}

	let strawberry = 0;
	let orange = 0;
	let meat = 0;

	let intensity = 1;

	export function set_intensity(n) {
		intensity = n;
	}

	export function update() {

		//updateHyper();

		//return;

		strawberry = cart(strawberry, 0.9);
		orange = cart(orange, 1.5);
		meat = cart(meat, 0.4);

		let x = Math.sin(strawberry);
		let y = Math.cos(orange) / 2;
		let z = Math.sin(meat) + 1 / 4;

		//x *= intensity;
		y *= intensity;
		z *= intensity;

		effect.uniforms['angle'].value = x * strawberry;
		effect.uniforms['redblue'].value = y * z * 0.0045;
	}

	let bat = 0;
	export function updateHyper() {
		bat = cart(bat, 5);

		effect.uniforms['angle'].value = bat;
		effect.uniforms['redblue'].value = bat * 0.5;
	}

	export function resize() {
		effect.uniforms["resolution"].value.set(
			window.innerWidth, window.innerHeight).multiplyScalar(window.devicePixelRatio);
	}

	export function init() {
		composer = new TWO.EffectComposer(Four.renderer);
		renderPass = new TWO.RenderPass(Four.scene, Four.camera);

		composer.addPass(renderPass);

		effect = new TWO.ShaderPass(retroShader);

		effect.uniforms['redblue'].value = 0.0015 * 0.5;
		effect.uniforms["resolution"].value =
			new Vector2(window.innerWidth, window.innerHeight);
		effect.uniforms["resolution"].value.multiplyScalar(
			window.devicePixelRatio);
		effect.renderToScreen = true;

		composer.addPass(effect);
	}

	export var retroShader = {

		uniforms: {
			"tDiffuse": { value: null }, // implicit
			"tUI": { value: null }, // 
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
			uniform sampler2D tUI;
			uniform float redblue;
			uniform float angle;
			
			varying vec2 vUv;

			vec4 siift(sampler2D t) {
				vec2 offset = redblue * vec2( cos(angle), sin(angle) );
				
				vec4 cr = texture2D(t, vUv + offset);
				vec4 cga = texture2D(t, vUv);
				vec4 cb = texture2D(t, vUv - offset);

				return vec4(cr.r, cga.g, cb.b, cga.a);
			}

			void main() {

				vec4 a = siift(tDiffuse);
				vec4 b = siift(tUI);

				gl_FragColor = a + b;
			}`

	};
}