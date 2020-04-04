import KILL from "../KILL"
import Four from "../Four"

import EasingFunctions from "./Easing"
import App from "../App"

// todo construct a utility type from the length of the stages array,
// so that we can make a cool tuple for the Zoom.Set so that we dont
// have to write 0 | 1 | 2 | 3

// http://www.typescriptlang.org/docs/handbook/advanced-types.html

namespace Cameraz {
	export var dontZoom = false;
	export var allowManual = true;
	export var stage = 2
	export var stages = [150, 300, 600, 1200, 2400]

	export let zoomCur = 600
	export let zoomTarget = 600
	export let zoom = 600

	let t = 0

	export var ZOOMDUR = 1

	export function set2(target) {
		t = 0;
		zoomTarget = target;
		zoomCur = Four.camera.position.z;
		dontZoom = false;
	}

	export function set(st: 0 | 1 | 2 | 3) {
		t = 0;
		zoomCur = zoom;
		stage = st;
	}

	export function update() {

		const z = App.map[90] == 1;

		if (z && allowManual) {
			dontZoom = false;
			t = 0;
			zoomCur = zoom;
			stage =
				stage < stages.length - 1 ? stage + 1 : 0;
			zoomTarget = stages[stage];
			console.log('z stage', stage);
		}

		if (dontZoom)
			return;

		t += Four.delta / ZOOMDUR;

		t = Math.min(Math.max(t, 0.0), 1.0);

		const difference = zoomTarget - zoomCur;

		const T = EasingFunctions.inOutCubic(t);
		zoom = zoomCur + (T * difference);

		const data = KILL.view;
		Four.camera.position.set(data.x * 64, data.y * 64, zoom);

	}
}

export default Cameraz;