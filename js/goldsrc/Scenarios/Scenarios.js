export var Scenarios;
(function (Scenarios) {
    function load(p) {
        Scenarios.current = p;
        Scenarios.current.load();
    }
    Scenarios.load = load;
    function update() {
        if (Scenarios.current)
            Scenarios.current.update();
    }
    Scenarios.update = update;
})(Scenarios || (Scenarios = {}));
;
export default Scenarios;
