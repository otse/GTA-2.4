import { Vector3, MeshPhongMaterial } from 'three';
var Phong2;
(function (Phong2) {
    // Taken from
    // https://raw.githubusercontent.com/mrdoob/three.js/dev/src/renderers/shaders/ShaderLib/meshphong_frag.glsl.js
    //var customMaterial: THREE.ShaderMaterial;
    function rig() {
    }
    Phong2.rig = rig;
    function makeRectangle(phongProperties, p) {
        let customMaterial = new MeshPhongMaterial(phongProperties);
        customMaterial.onBeforeCompile = function (shader) {
            shader.uniforms.blurMap = { value: p.blurMap };
            shader.uniforms.pink = { value: new Vector3(1, 0, 1) };
            shader.fragmentShader = shader.fragmentShader.replace(`#define PHONG`, `
				#define PHONG
				#define PHONG2
				
				uniform sampler2D blurMap;
			`);
            shader.fragmentShader = shader.fragmentShader.replace(`#include <map_fragment>`, `
				#ifdef USE_MAP
				
					vec4 texelColor = vec4(0);
					
					vec4 mapColor = texture2D( map, vUv );

					//#ifdef PINK

					// Pink
					if ( mapColor.rgb == vec3(1, 0, 1) ) {
						mapColor.a = 0.0;
						mapColor.rgb *= 0.0;
					}

					// Blur
					vec4 blurColor = texture2D( blurMap, vUv );
					blurColor.rgb *= 0.0;
					blurColor.a /= 2.0; // detensify
					texelColor = blurColor + mapColor;

					texelColor = mapTexelToLinear( texelColor );

					diffuseColor *= texelColor;

				#endif
			`);
        };
        return customMaterial;
    }
    Phong2.makeRectangle = makeRectangle;
    function makeRectangleShadow(phongProperties, p) {
        let customMaterial = new MeshPhongMaterial(phongProperties);
        customMaterial.onBeforeCompile = (shader) => {
            shader.uniforms.pink = { value: new Vector3(1, 0, 1) };
            shader.fragmentShader = shader.fragmentShader.replace(`#define PHONG`, `
				#define PHONG
				#define PHONG2

				// add uniforms here
			`);
            shader.fragmentShader = shader.fragmentShader.replace(`#include <map_fragment>`, `
				#ifdef USE_MAP
				
					vec4 texelColor = vec4(0);
					
					vec4 mapColor = texture2D( map, vUv );

					// Pink
					if ( mapColor.rgb == vec3(1, 0, 1) ) {
						mapColor.a = 0.0;
						mapColor.rgb *= 0.0;
					}

					texelColor = mapColor;

					texelColor = mapTexelToLinear( texelColor );

					diffuseColor *= texelColor;

				#endif
			`);
        }; // onBeforeCompile
        return customMaterial;
    }
    Phong2.makeRectangleShadow = makeRectangleShadow;
})(Phong2 || (Phong2 = {}));
export default Phong2;
