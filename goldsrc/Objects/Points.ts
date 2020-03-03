export namespace Points {

	/*export interface Point {
		x: number;
		y: number;
	}*/

	export function make(x: number, y: number) {
		return { x: x, y: y }
	}

	export function copy(a: Point) {
		return { x: a.x, y: a.y }
	}


	export function floor(a: Point): Point {
		return make(Math.floor(a.x), Math.floor(a.y))
	}

	export function floor2(x: number, y: number): Point {
		return make(Math.floor(x), Math.floor(y))
	}


	export function different(a: Point, b: Point) {
		return a.x - b.x || a.y - b.y
	}

	export function same(a: Point, b: Point) {
		return !different(a, b)
	}


	export function multp(a: Point, n: number): Point {
		let b = copy(a);
		return make(
			b.x * n,
			b.y * n);
	}

	export function region(a: Point, n: number): Point {
		return floor2(
			a.x / n,
			a.y / n);
	}

}

export default Points;