var EasingFunctions;
(function (EasingFunctions) {
    // no easing, no acceleration
    function linear(t) {
        return t;
    }
    EasingFunctions.linear = linear;
    // Accelerating from zero velocity
    function inQuad(t) {
        return t * t;
    }
    EasingFunctions.inQuad = inQuad;
    // Decelerating to zero velocity
    function easeOutQuad(t) {
        return t * (2 - t);
    }
    EasingFunctions.easeOutQuad = easeOutQuad;
    // Acceleration until halfway, then deceleration
    function inOutQuad(t) {
        return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
    EasingFunctions.inOutQuad = inOutQuad;
    // Accelerating from zero velocity 
    function inCubic(t) {
        return t * t * t;
    }
    EasingFunctions.inCubic = inCubic;
    // Decelerating to zero velocity 
    function outCubic(t) {
        return (--t) * t * t + 1;
    }
    EasingFunctions.outCubic = outCubic;
    // Acceleration until halfway, then deceleration 
    function inOutCubic(t) {
        return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }
    EasingFunctions.inOutCubic = inOutCubic;
    // Accelerating from zero velocity 
    function inQuart(t) {
        return t * t * t * t;
    }
    EasingFunctions.inQuart = inQuart;
    // Decelerating to zero velocity 
    function outQuart(t) {
        return 1 - (--t) * t * t * t;
    }
    EasingFunctions.outQuart = outQuart;
    // Acceleration until halfway, then deceleration
    function inOutQuart(t) {
        return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
    }
    EasingFunctions.inOutQuart = inOutQuart;
    // Accelerating from zero velocity
    function inQuint(t) {
        return t * t * t * t * t;
    }
    EasingFunctions.inQuint = inQuint;
    // Decelerating to zero velocity
    function outQuint(t) {
        return 1 + (--t) * t * t * t * t;
    }
    EasingFunctions.outQuint = outQuint;
    // Acceleration until halfway, then deceleration 
    function inOutQuint(t) {
        return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
    }
    EasingFunctions.inOutQuint = inOutQuint;
})(EasingFunctions || (EasingFunctions = {}));
export default EasingFunctions;
