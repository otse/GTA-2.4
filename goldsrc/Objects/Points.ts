export namespace Points {

	/*export interface Point {
		x: number;
		y: number;
	}*/

	export function make(x: number, y: number) {
		return { x: x, y: y }
	}

	export function copy(src: Point) {
		return { x: src.x, y: src.y }
	}

	export function same(a: Point, b: Point) {
		return !different(a, b)
	}

	export function different(a: Point, b: Point) {
		return a.x - b.x || a.y - b.y
	}

	export function floor(a: Point): Point {
		return make(Math.floor(a.x), Math.floor(a.y))
	}
	
}

export default Points;