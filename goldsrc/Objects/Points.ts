export namespace Points {

    /*export interface Point {
        x: number;
        y: number;
    }*/

    export function Make(x: number, y: number) {
        return { x: x, y: y }
    }

    export function Copy(src: Point) {
        return { x: src.x, y: src.y }
    }

    export function Same(a: Point, b: Point) {
        return !Different(a, b)
    }

    export function Different(a: Point, b: Point) {
        return a.x - b.x || a.y - b.y
    }

    export function Floor(a: Point): Point {
        return Make(Math.floor(a.x), Math.floor(a.y))
    }
    
}

export default Points;