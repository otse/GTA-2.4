import { Vector3, MeshPhongMaterial } from 'three';
var Phong2;
(function (Phong2) {
    // Taken from
    // https://raw.githubusercontent.com/mrdoob/three.js/dev/src/renderers/shaders/ShaderLib/meshphong_frag.glsl.js
    //var customMaterial: THREE.ShaderMaterial;
    function rig() {
    }
    Phong2.rig = rig;
    function make(p) {
        let o = {
            name: 'Phong2',
            transparent: true,
            map: p.map,
        };
        let customMaterial = new MeshPhongMaterial(o);
        customMaterial.onBeforeCompile = (shader) => {
            if (p.BLUR)
                shader.uniforms.blurMap = { value: p.blurMap };
            shader.uniforms.pink = { value: new Vector3(1, 0, 1) };
            shader.fragmentShader = shader.fragmentShader.replace(`#define PHONG`, `
				#define PHONG
				#define PHONG2
				`
                +
                    (p.BLUR ? '#define BLUR \n' : '') +
                (p.PINK ? '#define PINK \n' : '') +
                `

				#ifdef BLUR
					uniform sampler2D blurMap;
				#endif
			`);
            shader.fragmentShader = shader.fragmentShader.replace(`#include <map_fragment>`, `
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
        }; // onBeforeCompile
        return customMaterial;
    }
    Phong2.make = make;
})(Phong2 || (Phong2 = {}));
export default Phong2;
