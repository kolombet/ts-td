import KPoint from "./KPoint";
import Pools from "./pools";
import Vec2 from "./vec2";
import {IPoint} from "./interfaces";

export default class IsoTransform {
    public static fromP(p: KPoint): KPoint {
        let result: KPoint = Pools.point.object;
        result.x = p.x - p.y;
        result.y = (p.x + p.y) >> 1;
        return result;
    }

    public static toP(p: IPoint): KPoint {
        let result: KPoint = Pools.point.object;
        result.x = (p.x >> 1) + p.y;
        result.y = p.y - (p.x >> 1);
        return result;
    }

    public static from(p: Vec2): Vec2 {
        let result: Vec2 = Pools.vec2.object;
        result.x = p.x - p.y;
        result.y = (p.x + p.y) >> 1;
        return result;
    }

    public static to(p: Vec2): Vec2 {
        let result: Vec2 = Pools.vec2.object;
        result.x = (p.x >> 1) + p.y;
        result.y = p.y - (p.x >> 1);
        return result;
    }
}
