
import BaseCreepData from "./baseCreepData";
import { IEffect } from "./interfaces";
import EffectType from "./effectType";

export default class SingleDamage implements IEffect {
    private _damage: number;

    constructor(damage: number) {
        this._damage = damage;
    }

    public execute(target: BaseCreepData): void {
        target.hit(this._damage);
    }

    public getType(): EffectType {
        return EffectType.SingleDamage;
    }

    public getValue() {
        return this._damage;
    }
}