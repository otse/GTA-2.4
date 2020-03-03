import KILL from "../KILL"
import Four from "../Four"

import EasingFunctions from "./Easing"
import App from "../App"

// todo construct a utility type from the length of the stages array,
// so that we can make a cool tuple for the Zoom.Set so that we dont
// have to write 0 | 1 | 2 | 3

// http://www.typescriptlang.org/docs/handbook/advanced-types.html

namespace Zoom {
	export var stage = 2
	export var stages = [150, 300, 600, 1200]

	let broom = 600
	let zoom = 600

	let t = 0

	const SECONDS = 1

	export function set(st: 0 | 1 | 2 | 3) {
		t = 0;
		broom = zoom;
		stage = st;
	}

	export function update() {

		if (!KILL.ply)
			return;

		const z = App.map[90] == 1;

		if (z) {
			t = 0;
			broom = zoom;
			stage =
				stage < stages.length - 1 ? stage + 1 : 0;
		}

		t += Four.delta / SECONDS;

		t = Math.min(Math.max(t, 0.0), 1.0);

		const difference = stages[stage] - broom;

		const T = EasingFunctions.inOutCubic(t);
		zoom = broom + (T * difference);

		const data = KILL.ply.data;
		Four.camera.position.set(data.x * 64, data.y * 64, zoom);

	}
}

export default Zoom;