namespace EasingFunctions {
	// no easing, no acceleration
	export function linear(t) {
		return t
	}

	// Accelerating from zero velocity
	export function inQuad(t) {
		return t * t
	}

	// Decelerating to zero velocity
	export function easeOutQuad(t) {
		return t * (2 - t)
	}

	// Acceleration until halfway, then deceleration
	export function inOutQuad(t) {
		return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
	}

	// Accelerating from zero velocity 
	export function inCubic(t) {
		return t * t * t
	}

	// Decelerating to zero velocity 
	export function outCubic(t) {
		return (--t) * t * t + 1
	}

	// Acceleration until halfway, then deceleration 
	export function inOutCubic(t) {
		return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
	}

	// Accelerating from zero velocity 
	export function inQuart(t) {
		return t * t * t * t
	}

	// Decelerating to zero velocity 
	export function outQuart(t) {
		return 1 - (--t) * t * t * t
	}

	// Acceleration until halfway, then deceleration
	export function inOutQuart(t) {
		return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t
	}

	// Accelerating from zero velocity
	export function inQuint(t) {
		return t * t * t * t * t
	}

	// Decelerating to zero velocity
	export function outQuint(t) {
		return 1 + (--t) * t * t * t * t
	}

	// Acceleration until halfway, then deceleration 
	export function inOutQuint(t) {
		return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
	}
}

export default EasingFunctions;