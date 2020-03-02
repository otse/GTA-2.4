import four from "./four";
import KILL from "./KILL";
import "./Chunks/Chunk list";
import "./Chunks/Chunk";
import "./Chunks/Chunks";
import "./Chunks/City";
export var app;
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
        four.init();
        KILL.init();
        loop(0);
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
        KILL.update();
        four.render();
        app.wheel = 0;
        delay();
    };
})(app || (app = {}));
window['app'] = app;
export default app;
