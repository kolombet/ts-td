import BaseCreepData from "./baseCreepData";
import KPoint from "./KPoint";
import Console from "./console";
import { IEffect } from "./interfaces";
import EffectType from "./effectType";

export default class AOEDamage implements IEffect {
	private _explosionRadius: number;
	private _explosionDamage: number;

	constructor(explosionRadius: number, explosionDamage: number) {
		this._explosionRadius = explosionRadius;
		this._explosionDamage = explosionDamage;
	}

	//find all creeps in range
	public execute(target: BaseCreepData): void {
		let creeps: BaseCreepData[] = target.state.creepManager.collection;
		let targetPoint: KPoint = new KPoint(target.x, target.y);
		for (let i: number = 0; i < creeps.length; i++) {
			let range: number = creeps[i].calculateRangeTo(targetPoint);
			if (range <= this._explosionRadius) {
				//console.log("victim: " + creeps[i].id);
				creeps[i].hit(this._explosionDamage);
			}
		}
	}

	public getType(): EffectType {
		return EffectType.AOEDamage;
	}

    getValue(): number {
        return this._explosionDamage;
    }
}