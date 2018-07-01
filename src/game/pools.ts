import Vec2 from './vec2'
import KPoint from './KPoint';

export default class Pools {
    public static vec2: ObjectPool;
    public static point: ObjectPool;

    constructor() {
        Pools.vec2 = new ObjectPool(true);
        Pools.vec2.allocate(100, () => { return new Vec2() });

        Pools.point = new ObjectPool(true);
        Pools.point.allocate(50, () => { return new KPoint(0, 0) });
    }
}

class ObjectPool {
    _factory: Function;
    constructor(test: boolean) {

    }

    allocate(a: number, factory: Function) {
        this._factory = factory;
    }

    get object(): any {
        return this._factory();
    }

    set object(value: any) {

    }
}