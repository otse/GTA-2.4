import Four from "./Renderer";
import KILL from "./KILL";
export var App;
(function (App) {
    App.map = {};
    App.wheel = 0;
    App.move = [0, 0];
    App.left = false;
    function onkeys(event) {
        const key = event.key;
        //console.log(event);
        if ('keydown' == event.type)
            App.map[key] = (undefined == App.map[key])
                ? 1 /* PRESSED */
                : 3 /* AGAIN */;
        else if ('keyup' == event.type)
            App.map[key] = 0 /* UP */;
        if (key == 114) // f3
            event.preventDefault();
        return;
    }
    function onwheel(event) {
        let up = event.deltaY < 0;
        App.wheel = up ? 1 : -1;
    }
    function onmove(event) {
        App.move[0] = event.clientX;
        App.move[1] = event.clientY;
    }
    function ondown(event) {
        if (event.button == 0)
            App.left = true;
    }
    function onup(event) {
        if (event.button == 0)
            App.left = false;
    }
    function boot() {
        document.onkeydown = document.onkeyup = onkeys;
        document.onmousemove = onmove;
        document.onmousedown = ondown;
        document.onmouseup = onup;
        document.onwheel = onwheel;
        Four.init();
        KILL.init();
        loop(0);
    }
    App.boot = boot;
    const delay = () => {
        for (let i in App.map) {
            if (1 /* PRESSED */ == App.map[i])
                App.map[i] = 2 /* DELAY */;
            else if (0 /* UP */ == App.map[i])
                delete App.map[i];
        }
    };
    const loop = (timestamp) => {
        requestAnimationFrame(loop);
        KILL.update();
        Four.render();
        App.wheel = 0;
        delay();
    };
})(App || (App = {}));
window['app'] = App;
export default App;
