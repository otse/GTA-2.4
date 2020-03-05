import Four from "../Four";
import { default as THREE, Vector3, MeshPhongMaterial, MeshPhongMaterialParameters } from 'three';

namespace Phong2 {

	// Taken from
	// https://raw.githubusercontent.com/mrdoob/three.js/dev/src/renderers/shaders/ShaderLib/meshphong_frag.glsl.js

	//var customMaterial: THREE.ShaderMaterial;
	export function rig() {

	}

	export function make(phongProperties: MeshPhongMaterialParameters, p: any) {

		let customMaterial = new MeshPhongMaterial(phongProperties);

		customMaterial.onBeforeCompile = (shader) => {
			
			if (p.blurMap)
				shader.uniforms.blurMap = { value: p.blurMap };

			shader.uniforms.pink = { value: new Vector3(1, 0, 1) };

			shader.fragmentShader = shader.fragmentShader.replace(
				`#define PHONG`,
				`
				#define PHONG
				#define PHONG2
				`
				+
				(p.blurMap ? '#define BLUR \n' : '') +
				(p.PINK ? '#define PINK \n' : '') +
				`
				
				#ifdef BLUR
					uniform sampler2D blurMap;
				#endif
			`
			);

			shader.fragmentShader = shader.fragmentShader.replace(
				`#include <map_fragment>`,
				`
				#ifdef USE_MAP
				
					vec4 texelColor = vec4(0);
					
					vec4 mapColor = texture2D( map, vUv );

					#ifdef PINK
						// Pink pixels
						if ( mapColor.rgb == vec3(1, 0, 1) ) {
							mapColor.a = 0.0;
							mapColor.rgb *= 0.0;
						}
					#endif

					#ifdef BLUR
						vec4 blurColor = texture2D( blurMap, vUv );
						blurColor.rgb *= 0.0;
						blurColor.a /= 1.5;
						texelColor = blurColor + mapColor;
					#else
						texelColor = mapColor;
					#endif

					texelColor = mapTexelToLinear( texelColor );

					diffuseColor *= texelColor;

				#endif
			`);
			
		} // onBeforeCompile

		return customMaterial;
	}
}

export default Phong2;