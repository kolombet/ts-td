class ImmutableVector {
    _x: number;
    _y: number;

    constructor(x: number = 0, y: number = 0) {
        this._x = x;
        this._y = y;
    }

    public get x(): number {
        return this._x;
    }

    public get y(): number {
        return this._y;
    }
}

class Vector extends ImmutableVector {
    constructor(x: number = 0, y: number = 0) {
        super(x, y);
    }

    public set x(x: number) {
        this._x = x;
    }

    public set y(y: number) {
        this._y = y;
    }
}

export default function test() {
    let immutable = new ImmutableVector(100, 100);
    //console.log(immutable.x); // output: 100

    let mutable = new Vector(200, 200);
    //console.log(mutable.x); // output: undefined
}