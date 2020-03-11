export var DefaultScenarios;
(function (DefaultScenarios) {
    function init() {
        console.log('default scenarios init');
        const theMission = function () {
        };
        let palmTrees = {
            name: 'Palm Trees',
            func: theMission
        };
    }
    DefaultScenarios.init = init;
    ;
})(DefaultScenarios || (DefaultScenarios = {}));
export default DefaultScenarios;
