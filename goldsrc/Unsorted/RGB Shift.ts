import Zoom from "./Zoom";
import Four from "../Four";

import { default as THREE, Vector2 } from "three";

const TWO = (THREE as any)

export namespace Movie {
	export var enabled = false;

	export var composer;
	export var effect;
	export var renderPass;

	export function cityView() {
		Zoom.set(2);
		Movie.effect.uniforms["pixelSize"].value = 1.0;
		Movie.effect.uniforms["zoom"].value = 0.0;
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

	export function update() {

		strawberry = cart(strawberry, 1);
		orange = cart(orange, 1.5);

		let x = Math.sin(strawberry);
		let y = Math.cos(orange);

		effect.uniforms['angle'].value = x * strawberry;
		effect.uniforms['redblue'].value = y * 0.005;
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
			"tDiffuse": { value: null },
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
			uniform float redblue;
			uniform float angle;

			uniform float zoom;
			uniform float pixelSize;
			uniform vec2 resolution;

			varying vec2 vUv;

			float reduce(float p) {
				float DIVIDE = 8.0;
				return (ceil((p * 255.0) / DIVIDE) * DIVIDE) / 255.0;
				// ceil is lighter, floor is darker
			}

			vec4 R2D2(vec2 v) {
				vec4 rgb = texture2D(tDiffuse, v);
				rgb.r = reduce(rgb.r);
				rgb.g = reduce(rgb.g);
				rgb.b = reduce(rgb.b);
				return rgb;
			}

			void main() {

				// cinematic retro city view
				/*if (pixelSize > 1.0) {

					vec2 dxy = pixelSize / resolution;
					vec2 coord = dxy * floor( vUv / dxy );

					vec2 uuu = coord; //coord; // vUv

					vec2 offset = redblue * vec2( cos(angle), sin(angle));
					vec4 cr = R2D2(uuu + offset);
					vec4 cga = R2D2(uuu);
					vec4 cb = R2D2(uuu - offset);

					vec4 shifty = vec4(cr.r, cga.g, cb.b, cga.a);
					gl_FragColor = shifty;

					//gl_FragColor = R2D2(uuu);
				}
				else */
				{
					vec2 offset = redblue * vec2( cos(angle), sin(angle));
					vec4 cr = texture2D(tDiffuse, vUv + offset);
					vec4 cga = texture2D(tDiffuse, vUv);
					vec4 cb = texture2D(tDiffuse, vUv - offset);

					vec4 shifty = vec4(cr.r, cga.g, cb.b, cga.a);
					gl_FragColor = shifty;
					//gl_FragColor = texture2D(tDiffuse, vUv);

				}

				#ifdef MAKE_BLACK
					
					gl_FragColor.rgb *= 0.0;

				#endif
			}`

	};
}