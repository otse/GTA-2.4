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

	export function string(a: Point) {
		return `${a.x},${a!.y}`
	}
	
	export function multp(a: Point, n: number): Point {
		return make(
			a.x * n,
			a.y * n);
	}

	export function region(a: Point, n: number): Point {
		return floor2(
			a.x / n,
			a.y / n);
	}

	export function real_space(a: Point): Point {
		return multp(
			a, 64);
	}

	export function dist(a: Point, b: Point): number {
		const dx = a.x - b.x, dy = a.y - b.y;
		
		return dx * dx + dy * dy;
	}
	
}

export default Points;