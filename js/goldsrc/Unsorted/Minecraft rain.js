import Util from "../Random";
import { MeshBasicMaterial, DoubleSide, Group, PlaneBufferGeometry, Mesh } from "three";
import Four from "../Four";
export var Rain;
(function (Rain) {
    Rain.what_a_rainy_day = true;
    Rain.drops = [];
    Rain.group = null;
    /*export function smat_init() {

        let map = td.map(`sty/drop.png`);

        const params = {
            name: 'Rain Material',
            fog: false,

            //map: map,
            //color: 0x93e5ff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: .5,
            lights: false,
            depthTest: false, // false: rain falls through everything

            vertexShader: rain_vert,
            fragmentShader: THREE.ShaderChunk.meshbasic_frag
        };

        const o = Object.assign({
            uniforms: THREE.UniformsUtils.merge([
                THREE.ShaderLib['basic'].uniforms, {
                    coords: { value: new THREE.Vector3(0, 0, 0) },
                    descend: { value: 0 }
                }
            ]),
            defines: { 'USE_MAP': '', 'DISTANCE': '' },
        }, params);

        smat = new THREE.ShaderMaterial(o);

        smat.map = map;

        smat.uniforms.map.value = map;
        smat.uniforms.diffuse.value = new THREE.Color(0x93e5ff);
        smat.uniforms.opacity.value = params.opacity;
    }*/
    /*export function smat_clone() {
        let mat = smat.clone();
        
        mat.uniforms.map.value = smat.map;
        mat.uniforms.coords.value = new THREE.Vector3(0, 0, 0);
        mat.uniforms.descend.value = 0;

        return mat;
    }*/
    function init() {
        //smat_init();
        let map = Util.loadTexture(`sty/drop.png`);
        Rain.basicmat = new MeshBasicMaterial({
            map: map,
            color: 0xe5f7fc,
            side: DoubleSide,
            transparent: true,
            opacity: .5,
            depthWrite: false,
        });
        Rain.group = new Group();
        Rain.group.rotation.y += 0.3;
        Rain.dropGeometry = new PlaneBufferGeometry(4, 1, 1, 1);
        Util.UV.rotatePlane(Rain.dropGeometry, 0, 3);
        Four.scene.add(Rain.group);
    }
    Rain.init = init;
    Rain.spread = 6;
    function make_drop() {
        if (Rain.drops.length > 500)
            return;
        let mesh = new Mesh(Rain.dropGeometry, Rain.basicmat);
        //mesh.matrixAutoUpdate = false;
        mesh.frustumCulled = false;
        const z = Four.camera.position.z;
        mesh.position.x = Four.camera.position.x + ((Math.random() - .5) * 64 * Rain.spread);
        mesh.position.y = Four.camera.position.y + ((Math.random() - .5) * 64 * Rain.spread);
        mesh.position.z = z;
        mesh.rotation.y = Math.PI / 2;
        //mesh.updateMatrix();
        let drop = {
            start: z,
            mesh: mesh,
            rand: Math.random()
        };
        Rain.drops.push(drop);
        Rain.group.add(mesh);
    }
    Rain.make_drop = make_drop;
    const HALF_FPS = true;
    const speed = HALF_FPS ? 7.0 : 3.5;
    let alternate = false;
    function update() {
        if (!Rain.what_a_rainy_day)
            return;
        alternate = !alternate;
        if (HALF_FPS && alternate)
            return;
        make_drop();
        make_drop();
        make_drop();
        make_drop();
        make_drop();
        make_drop();
        make_drop();
        make_drop();
        make_drop();
        make_drop();
        let i = Rain.drops.length;
        while (i--) {
            let drop = Rain.drops[i];
            const fall = speed + drop.rand;
            drop.mesh.position.z -= fall;
            if (drop.start > drop.mesh.position.z + 300 || drop.mesh.position.z <= 0) {
                //drops.splice(i, 1);
                const z = Four.camera.position.z + 100;
                drop.start = z;
                drop.mesh.position.x = Four.camera.position.x + ((Math.random() - .5) * 64 * Rain.spread);
                drop.mesh.position.y = Four.camera.position.y + ((Math.random() - .5) * 64 * Rain.spread);
                drop.mesh.position.z = z;
                //drop.mesh.updateMatrix();
                //group.remove(drop.mesh);
            }
        }
    }
    Rain.update = update;
})(Rain || (Rain = {}));
