import Object2 from "../Object";
import Util from "../../Random";
import { default as THREE, Mesh, MeshPhongMaterial, Color } from "three";
import Four from "../../Four";
export class Wall extends Object2 {
    constructor(data) {
        super(data);
        console.log('Wall');
        this.make();
    }
    destroy() {
        super.destroy();
    }
    make() {
        this.geometry = new THREE.PlaneBufferGeometry(64, 64, 1, 1);
        let map = Util.loadTexture(this.data.sty);
        let maskMap;
        if ('concave' == this.data.wall)
            maskMap = Util.loadTexture('sty/interior/green/maskConcave.bmp');
        else
            maskMap = Util.loadTexture('sty/interior/green/maskSide.bmp');
        this.material = new MeshPhongMaterial({
            map: map,
            shininess: 0,
            transparent: true,
            color: new Color(this.data.color),
        });
        this.material.onBeforeCompile = function (shader) {
            shader.uniforms.maskMap = { value: maskMap };
            shader.fragmentShader = shader.fragmentShader.replace(`#define PHONG`, `
                #define PHONG
                
				#define INTERIOR_WALL
				
				uniform sampler2D maskMap;
			`);
            // https://github.com/mrdoob/three.js/tree/dev/src/renderers/shaders/ShaderChunk/map_fragment.glsl.js
            shader.fragmentShader = shader.fragmentShader.replace(`#include <map_fragment>`, `
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
        this.mesh.position.set(this.data.x * 64 + 32, this.data.y * 64 + 32, this.data.z * 64);
        this.mesh.updateMatrix();
        if (this.data.flip)
            Util.UV.flipPlane(this.geometry, 0, true);
        if (this.data.r)
            Util.UV.rotatePlane(this.geometry, 0, this.data.r);
        Four.scene.add(this.mesh);
    }
}
export default Wall;
