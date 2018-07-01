import { IEffect } from "./interfaces";
import BaseCreepData from "./baseCreepData";
import EffectType from "./effectType";

export default class SlowEffect implements IEffect {
	private _freezeDuration: number;
	private _freezeModifier: number;

	constructor(freezeDuration: number, freezeModifier) {
		this._freezeDuration = freezeDuration;
		this._freezeModifier = freezeModifier;
	}

	public execute(target: BaseCreepData): void {
		target.applyFreeze(this._freezeDuration, this._freezeModifier);
	}

	public getType(): EffectType {
		return EffectType.SlowEffect;
	}

	public getValue(): number {
		return 0;
	}
}