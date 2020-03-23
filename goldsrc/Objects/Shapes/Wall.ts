import Data2 from "../Data";
import Object2 from "../Object";

import Surfaces from "../Shapes/Surfaces";
import Sprites from "../../Sprites/Sprites";
import Sheets from "../../Sprites/Sheets";

import Util from "../../Random";

import { default as THREE, Mesh, Material, PlaneBufferGeometry, MeshPhongMaterial, Color, DoubleSide, Texture, Shader } from "three";
import Points from "../Points";
import Four from "../../Four";

export class Wall extends Object2 {

    mesh: Mesh
    material: Material
    geometry: PlaneBufferGeometry

    constructor(data: Data2) {
        super(data);

        console.log('Wall');


        this.make();
    }

    destroy() {
        super.destroy();
    }

    make() {
        this.geometry = new THREE.PlaneBufferGeometry(64, 64, 1, 1);

		let style = `sty/interiors/${this.data.style}`;
        
        let sty, mask;
        
        if ('concave' == this.data.wall) {
            sty = `concave.bmp`;
            mask = `concaveMask.bmp`;
        }
        else
        {
            sty = `side.bmp`;
            mask = `sideMask.bmp`;
        }

        let map = Util.loadTexture(`${style}/${sty}`);
        let maskMap = Util.loadTexture(`${style}/${mask}`);

        this.material = new MeshPhongMaterial({
            map: map,
            shininess: 0,
            transparent: true,
            color: new Color(this.data.color),
            //side: DoubleSide
        });
        
        this.material.onBeforeCompile = function (shader: Shader) {

			shader.uniforms.maskMap = { value: maskMap };

            shader.fragmentShader = shader.fragmentShader.replace(
				`#define PHONG`,
				`
                #define PHONG
                
				#define INTERIOR_WALL
				
				uniform sampler2D maskMap;
			`
            );

            // https://github.com/mrdoob/three.js/tree/dev/src/renderers/shaders/ShaderChunk/map_fragment.glsl.js
            
            shader.fragmentShader = shader.fragmentShader.replace(
                `#include <map_fragment>`,
                `
				#ifdef USE_MAP
				
                    vec4 texelColor = texture2D( map, vUv );
                    vec4 maskColor = texture2D( maskMap, vUv );
                    
                    texelColor.rgb *= maskColor.r;

					texelColor = mapTexelToLinear( texelColor );
					diffuseColor *= texelColor;

				#endif
			`);
        };


        this.mesh = new Mesh(this.geometry, this.material);
        this.mesh.matrixAutoUpdate = false;
        this.mesh.frustumCulled = false;

        this.mesh.position.set(
            this.data.x * 64 + 32,
            this.data.y * 64 + 32,
            this.data.z * 64);

        this.mesh.updateMatrix();

        if (this.data.f)
            Util.UV.flipPlane(this.geometry, 0, true);
        if (this.data.r)
            Util.UV.rotatePlane(this.geometry, 0, this.data.r);

        Four.scene.add(this.mesh);
    }
}

export default Wall;