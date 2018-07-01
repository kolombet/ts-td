import {IPoint} from './interfaces';

export default class KPoint implements IPoint {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return "[" + this.x + " " + this.y + "]";
    }

    isEqual(p: KPoint): boolean {
        return p.x == this.x && p.y == this.y;
    }
}