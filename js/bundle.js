var gta_kill = (function (exports, three, Points, Objects, four$2, Datas) {
    'use strict';

    Points = Points && Points.hasOwnProperty('default') ? Points['default'] : Points;
    Objects = Objects && Objects.hasOwnProperty('default') ? Objects['default'] : Objects;
    four$2 = four$2 && four$2.hasOwnProperty('default') ? four$2['default'] : four$2;
    Datas = Datas && Datas.hasOwnProperty('default') ? Datas['default'] : Datas;

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
            const m = Math.ceil(City.spanUneven / 2);
            const d = Points.Make(Math.abs(p.x - chunk.w.x), Math.abs(p.y - chunk.w.y));
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
    var Chunks$1 = Chunks;

    // A chunk makes / destroys its datas / objects
    class Chunk {
        constructor(w) {
            //console.log(`chunk ${w.x} & ${w.y}`);
            this.currentlyActive = false;
            this.group = new three.Group;
            this.w = w;
            this.datas = [];
            this.objects = [];
            //Chunks.Scaffold(this);
        }
        update() {
            for (let object of this.objects)
                object.update();
        }
        fabricate(data) {
            let object = Objects.MakeNullable(data);
            if (!object)
                return;
            this.objects.push(object);
        }
        add(data) {
            this.datas.push(data);
            if (this.currentlyActive)
                this.fabricate(data);
        }
        remove(data) {
            this.datas.splice(this.datas.indexOf(data), 1);
            let object = data.object2;
            if (!object)
                return;
            object.destroy();
            this.objects.splice(this.objects.indexOf(object), 1);
        }
        makeAdd() {
            //console.log('Chunk make n add');
            for (let data of this.datas)
                this.fabricate(data);
            this.currentlyActive = true;
            four$2.scene.add(this.group);
        }
        destroyRemove() {
            //console.log('Chunk destroy n remove');
            for (let object of this.objects)
                object.destroy();
            this.objects.length = 0; // Reset array
            this.currentlyActive = false;
            four$2.scene.remove(this.group);
        }
    }
    Chunk._tileSpan = 7; // use Chunks.tileSpan

    // Simple getters and chunk creation
    class ChunkList {
        constructor() {
            this.dict = {};
        }
        GetNullable(w) {
            let z = `${w.x} & ${w.y}`;
            let chunk = this.dict[z];
            return chunk || null;
        }
        Get2(x, y) {
            return this.Get({ x: x, y: y });
        }
        Get(w) {
            let z = `${w.x} & ${w.y}`;
            let chunk = this.dict[z];
            if (!chunk) {
                chunk = new Chunk(w);
                this.dict[z] = chunk;
            }
            return chunk;
        }
    }

    class City {
        constructor() {
            this.chunks = [];
            this.chunkList = new ChunkList;
            this.new = Points.Make(0, 0);
            this.old = Points.Make(100, 100);
        }
        update(p) {
            this.new = Datas.Big(p);
            if (Points.Same(this.new, this.old))
                return;
            console.log(`${this.old.x} & ${this.old.y} different to ${this.new.x} & ${this.new.y}`);
            this.old = Points.Copy(this.new);
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
                if (!Chunks$1.Vis(ch, to)) {
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
                    let z = Points.Make(x - m + to.x, y - m + to.y);
                    let ch = this.chunkList.GetNullable(z);
                    if (!ch)
                        continue;
                    if (!ch.currentlyActive) {
                        this.chunks.push(ch);
                        ch.makeAdd();
                        Chunks$1.Vis(ch, to);
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

}({}, THREE, Points, Objects, four$2, Datas));
