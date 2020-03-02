var gta_kill = (function (exports, three, defs, four$2) {
    'use strict';

    four$2 = four$2 && four$2.hasOwnProperty('default') ? four$2['default'] : four$2;

    class City {
        constructor() {
            this.chunks = [];
            this.chunkList = new defs.ChunkList;
            this.new = defs.Points.Make(0, 0);
            this.old = defs.Points.Make(100, 100);
        }
        update(p) {
            this.new = defs.Datas.Big(p);
            if (defs.Points.Same(this.new, this.old))
                return;
            console.log(`${this.old.x} & ${this.old.y} different to ${this.new.x} & ${this.new.y}`);
            this.old = defs.Points.Copy(this.new);
            this.off();
            this.on();
            for (let chunk of this.chunks) {
                chunk.update();
            }
        }
        // Find chunks outside the wide span
        // and turn them off with a negative for-loop
        off() {
            const to = this.new;
            let i = this.chunks.length;
            while (i--) {
                let ch = this.chunks[i];
                if (!defs.Chunks.Vis(ch, to)) {
                    this.chunks.splice(i, 1);
                    ch.destroyRemove();
                }
            }
        }
        // Now turn on any new areas inside
        // the small span
        on() {
            const to = this.new;
            const m = Math.floor(City.spanUneven / 2);
            for (let y = 0; y < City.spanUneven; y++) {
                for (let x = 0; x < City.spanUneven; x++) {
                    let z = defs.Points.Make(x - m + to.x, y - m + to.y);
                    let ch = this.chunkList.GetNullable(z);
                    if (!ch)
                        continue;
                    if (!ch.currentlyActive) {
                        this.chunks.push(ch);
                        ch.makeAdd();
                        defs.Chunks.Vis(ch, to);
                    }
                }
            }
        }
    }
    City.spanUneven = 5;

    var KILL;
    (function (KILL) {
        function init() {
            console.log('gta init');
            KILL.city = new City;
        }
        KILL.init = init;
        function update() {
        }
        KILL.update = update;
    })(KILL || (KILL = {}));
    var KILL$1 = KILL;

    //export { THREE };
    var four;
    (function (four) {
        four.delta = 0;
        function render() {
            four.delta = four.clock.getDelta();
            KILL$1.update();
            //if (Movie.enabled) {
            //	Movie.composer.render();
            //}
            //else {
            four.renderer.clear();
            four.renderer.render(four.scene, four.camera);
            //}
        }
        four.render = render;
        function init() {
            console.log('four init');
            four.clock = new three.Clock();
            four.camera = new three.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 2000);
            four.camera.position.z = 200;
            four.scene = new three.Scene();
            four.directionalLight = new three.DirectionalLight(0x355886, 0.5);
            four.ambientLight = new three.AmbientLight('#355886'); // #5187cd
            four.scene.add(four.directionalLight);
            four.scene.add(four.ambientLight);
            four.renderer = new three.WebGLRenderer({ antialias: false });
            four.renderer.setPixelRatio(window.devicePixelRatio);
            four.renderer.setSize(window.innerWidth, window.innerHeight);
            four.renderer.autoClear = true;
            four.renderer.setClearColor(0x777777, 1);
            document.body.appendChild(four.renderer.domElement);
            window.addEventListener('resize', onWindowResize, false);
        }
        four.init = init;
        function onWindowResize() {
            four.camera.aspect = window.innerWidth / window.innerHeight;
            four.camera.updateProjectionMatrix();
            four.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    })(four || (four = {}));
    var four$1 = four;

    var Chunks;
    (function (Chunks) {
        Chunks.tileSpan = 7;
        let geometry;
        let blue;
        let purple;
        const N = 64 * Chunks.tileSpan;
        function Init() {
            geometry = new three.BoxGeometry(N, N, 0);
            blue = new three.MeshBasicMaterial({ wireframe: true, color: 'blue' });
            purple = new three.MeshBasicMaterial({ wireframe: true, color: 'purple' });
        }
        Chunks.Init = Init;
        function Scaffold(chunk) {
            chunk.wireframe = new three.Mesh(geometry, purple);
            chunk.wireframe.position.set(((chunk.w.x + 1) * N) - N / 2, ((chunk.w.y + 1) * N) - N / 2, 0);
            chunk.group.add(chunk.wireframe);
        }
        Chunks.Scaffold = Scaffold;
        // This is the visibility test
        function Vis(chunk, p) {
            const m = Math.ceil(defs.City.spanUneven / 2);
            const d = defs.Points.Make(Math.abs(p.x - chunk.w.x), Math.abs(p.y - chunk.w.y));
            const outside = !(d.x > m || d.y > m);
            const wideSpan = d.x >= m || d.y >= m;
            const insideSpan = d.x <= m && d.y <= m;
            if (chunk.wireframe)
                chunk.wireframe.material =
                    wideSpan ? purple : blue;
            return insideSpan;
        }
        Chunks.Vis = Vis;
    })(Chunks || (Chunks = {}));

    (function (app) {
        app.map = {};
        app.wheel = 0;
        app.move = [0, 0];
        app.left = false;
        function onkeys(event) {
            const key = event.key;
            //console.log(event);
            if ('keydown' == event.type)
                app.map[key] = (undefined == app.map[key])
                    ? 1 /* PRESSED */
                    : 3 /* AGAIN */;
            else if ('keyup' == event.type)
                app.map[key] = 0 /* UP */;
            if (key == 114) // f3
                event.preventDefault();
            return;
        }
        function onwheel(event) {
            let up = event.deltaY < 0;
            app.wheel = up ? 1 : -1;
        }
        function onmove(event) {
            app.move[0] = event.clientX;
            app.move[1] = event.clientY;
        }
        function ondown(event) {
            if (event.button == 0)
                app.left = true;
        }
        function onup(event) {
            if (event.button == 0)
                app.left = false;
        }
        function boot() {
            document.onkeydown = document.onkeyup = onkeys;
            document.onmousemove = onmove;
            document.onmousedown = ondown;
            document.onmouseup = onup;
            document.onwheel = onwheel;
            four$1.init();
            KILL$1.init();
            loop();
        }
        app.boot = boot;
        const delay = () => {
            for (let i in app.map) {
                if (1 /* PRESSED */ == app.map[i])
                    app.map[i] = 2 /* DELAY */;
                else if (0 /* UP */ == app.map[i])
                    delete app.map[i];
            }
        };
        const loop = (timestamp) => {
            requestAnimationFrame(loop);
            KILL$1.update();
            four$1.render();
            app.wheel = 0;
            delay();
        };
    })(exports.app || (exports.app = {}));
    window['app'] = exports.app;
    var app = exports.app;

    exports.default = app;

    return exports;

}({}, THREE, defs, four$2));
