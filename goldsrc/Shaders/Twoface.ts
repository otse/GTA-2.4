import Four from "../Four";
import { default as THREE, Vector3, MeshPhongMaterial, MeshPhongMaterialParameters, Shader, Geometry } from 'three';

// attempt at a shader that could mix two surfaces using a black white mask
// never finished / started

namespace Twoface {

    // Taken from
    // https://raw.githubusercontent.com/mrdoob/three.js/dev/src/renderers/shaders/ShaderLib/meshphong_frag.glsl.js

    //var customMaterial: THREE.ShaderMaterial;
    export function rig() {
        
    }

    interface TwofaceParameters {
        map2;
        maskMap;
    }

    export function make(phongProperties: MeshPhongMaterialParameters, params: TwofaceParameters) {

        let customMaterial = new MeshPhongMaterial(phongProperties);

        customMaterial.onBeforeCompile = function (shader: Shader) {

            shader.uniforms.map2 = { value: params.map2 };
            shader.uniforms.maskMap = { value: params.maskMap };

            shader.vertexShader = shader.fragmentShader.replace(
                '',
                ''
            );

            shader.fragmentShader = shader.fragmentShader.replace(
                `#define PHONG`,
                `
				#define PHONG
				#define PHONG2
				
				uniform sampler2D map2;
				uniform sampler2D maskMap;
			`
            );

            shader.fragmentShader = shader.fragmentShader.replace(
                `#include <map_fragment>`,
                `
				#ifdef USE_MAP
				
					vec4 texelColor = vec4(0);
					
					vec4 mapColor = texture2D( map, vUv );
					vec4 map2Color = texture2D( map2, vUv );

                    texelColor = mix(mapColor, map2Color, 0.5);

					texelColor = mapTexelToLinear( texelColor );

					diffuseColor *= texelColor;

				#endif
			`);

            return 2;

        } // onBeforeCompile

        return customMaterial;
    }
}

export default Twoface;