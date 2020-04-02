import Chunks from "../Chunks/Chunks";
import Object2 from "../Objects/Object";

// uneven works well
const CELL_SPAN = 7;

// Coordination system for gta 22, 2.3
// x is left to right
// y is bottom to up

// Multiply by 64 to get gl space

//lol.Test

export namespace Space {

	// Swappable with Object-data
	export interface Point { x; y; z?; }

	// Aka Chunk-span
	export function big(a: Point): Point {
		return {
			x: Math.floor(a.x / Chunks.tileSpan),
			y: Math.floor(a.y / Chunks.tileSpan) };
	}

	export function add(a: Point, b: Point): Point {
		return { x: a.x + b.x, y: a.y + b.y };
	}

	export function dist(a: Point, b: Point): number {
		const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;

		return dx * dx + dy * dy;// + dz * dz;
	}

	export function fwdByAngle(object: Object2, dist, angle) {
		object.data.r = angle + Math.PI / 2;
		object.data.x += dist * Math.cos(angle);
		object.data.y += dist * Math.sin(angle);
	}
}

export default Space;