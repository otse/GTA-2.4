import Data2 from "../Objects/Data";

import Ped from "./Ped";
import Peds from "./Peds";

import App from "../App";
import Util from "../Random";
import Anims from "../Sprites/Anims";
import KILL from "../KILL";

export class Ply extends Ped {

	constructor(data: Data2) {
		super(data);

		console.log('Ply');

		KILL.ply = this;

		(window as any).ply = this;
	}

	update() {
		this.update_position();
	}

	manual_update() {
		//super.Update();

		const skooma = App.map[88]; // x

		if (App.map[16] == 1)
			this.run = !this.run;

		const A = App.map[65] && !App.map[68];
		const S = App.map[83] && !App.map[87];
		const W = App.map[87] && !App.map[83];
		const D = App.map[68] && !App.map[65];

		if (A || D) {
			const r = this.idle ? 50 : !this.run ? 55 : 60;

			this.data.r! += A ? Math.PI / r : Math.PI / -r;
		}

		if (W || S) {
			const dist = !this.run ? 0.5 / 64 : 1.5 / 64;
			let speed = W ? -dist : dist / 2;

			if (skooma)
				speed *= 2;

			this.data.x += speed * Math.sin(-this.data.r!);
			this.data.y += speed * Math.cos(-this.data.r!);

			Peds.play(this, this.run ? 'run' : 'walk');

			this.idle = false;
		}
		else if (!this.idle) {

			Anims.zero(this.timers.walk);
			Anims.zero(this.timers.run);

			Util.UV.fromSheet(this.geometry, { x: 1, y: 8 }, Peds.sheet);

			this.idle = true;
		}

		////this.gravitate();

		this.update_position();
	}
}

export default Ply;