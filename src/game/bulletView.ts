import Sprite from "starling/display/Sprite";
import { IGameView, IGameObj } from "./interfaces";
import BasicBulletData from "./basicBulletData";
import IsoTransform from "./isoTransform";
import App from "./app";
import { Guid } from "guid-typescript";
import KPoint from "./KPoint";
import EffectType from "./effectType";

export default class BulletView extends Sprite implements IGameView {
    private _data: BasicBulletData;
    private _uid: string;
    private _isDisposed: boolean = false;

    constructor(data: BasicBulletData) {
        super();
        this._uid = Guid.create().toString();
        this._data = data;
        let effectType = this._data.effect.getType();
        // console.log("effect type");
        if (effectType == EffectType.AOEDamage)
            this.addChild(App.resources.getBulletAoeFire())
        else if (effectType == EffectType.SingleDamage)
            this.addChild(App.resources.getBulletFire());
        else if (effectType == EffectType.SlowEffect)
            this.addChild(App.resources.getBulletFrost());
        else
            console.error("effect type not found");
    }

    public getGuid() {
        return this._uid;
    }

    public dispose(): void {
        super.dispose();
    }

    public advanceTime(time: number): void {
        if (this._data == null || this._data == undefined) {
            console.warn("data null");
            if (this._isDisposed == true) {
                //console.log("disposed but update called")
            }
            return;
        }

        let dataX = this._data.x;
        let dataY = this._data.y;
        let p = IsoTransform.fromP(new KPoint(dataX, dataY));
        this.x = p.x;
        this.y = p.y;
    }

    public getData(): IGameObj {
        return this._data;
    }

    public destroy(): void {
        //console.log("destroyed");
        this._isDisposed = true;
        this._data = null;
        super.dispose();
    }
}