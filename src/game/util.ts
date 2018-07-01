import Vec2 from './vec2';
import {IGameObj} from './interfaces'

export default class Util {
    constructor() {
    }

    public static distanceVect(obj1: IGameObj, obj2: IGameObj): Vec2 {
        return new Vec2(obj1.x - obj2.x, obj1.y - obj2.y);
    }

    public static vecLength(_x: number, _y: number): number {
        return Math.sqrt(_x * _x + _y * _y);
    }

    public static outFile(fileName: string, text: string): void {
        const pom = document.createElement('a');
        pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        pom.setAttribute('download', fileName);

        if (document.createEvent) {
            const event = document.createEvent('MouseEvents');
            event.initEvent('click', true, true);
            pom.dispatchEvent(event);
        }
        else {
            pom.click();
        }
    }
}

