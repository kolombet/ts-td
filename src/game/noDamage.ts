import BaseCreepData from "./baseCreepData";
import { IEffect } from "./interfaces";
import EffectType from "./effectType";

export default class NoDamage implements IEffect {
    constructor() {
    }

    public execute(target: BaseCreepData): void {
    }

    public getType(): EffectType {
        return EffectType.SingleDamage;
    }

    public getValue() {
        return 0;
    }
}