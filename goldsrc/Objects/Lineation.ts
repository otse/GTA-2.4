import { Chunks } from "@app/exports";

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
    export function Big(a: Point): Point {
        return {
            x: Math.floor(a.x / Chunks.tileSpan),
            y: Math.floor(a.y / Chunks.tileSpan) };
    }

    export function Add(a: Point, b: Point): Point {
        return { x: a.x + b.x, y: a.y + b.y };
    }

	export function Dist(a: Point, b: Point): number {
		const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;

		return dx * dx + dy * dy;// + dz * dz;
	}

	export function FwdByAngle(object: Object2, dist, angle) {
		object.data.r = angle + Math.PI / 2;
        object.data.x += dist * Math.cos(angle);
		object.data.y += dist * Math.sin(angle);
	}
}

export default Space;