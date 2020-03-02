var gta_kill = (function (exports, three) {
    'use strict';

    var KILL;
    (function (KILL) {
        function init() {
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

}({}, THREE));
