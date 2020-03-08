import Four from "../Four";

export namespace Anims {

	export type List = { [key: string]: Anims.Timer };

	export interface Timer {
		i: number;
		timer: number;
		def: Def;
	}

	export interface Def {
		frames: number;
		moment: number;
		spriteArray?: Square[];
	}

	export function zero(a: Timer) {
		a.timer = 0;
		a.i = 0;
	}

	export function update(a: Timer) {

		a.timer += Four.delta;

		if (a.timer < a.def.moment)
			return;

		const end = a.i + 1 == a.def.frames;

		!end ? a.i++ : a.i = 0;

		a.timer = 0;
	}

}

export default Anims;