import { IDestroyable, IAnimatable, IEffect } from "./interfaces";
import { PlayState } from "./playState";
import Signal from "./Signal";
import BaseCreepData from "./baseCreepData";
import BasicBulletData from "./basicBulletData"

export default class BulletManager implements IDestroyable, IAnimatable {
	private _state: PlayState;
	private _collection: BasicBulletData[];
	private _onBulletSpawned: Signal = new Signal(BasicBulletData);
	private _onBulletDestroyed: Signal = new Signal(BasicBulletData);

	constructor(state: PlayState) {
		this._state = state;
		this._collection = [];
	}

	public advanceTime(time: number): void {
		for (let i: number = 0; i < this._collection.length; i++) {
			this._collection[i].advanceTime(time);
		}
	}

	public spawn(target: BaseCreepData, effect: IEffect, startX: number, startY: number): void {
		let data: BasicBulletData = new BasicBulletData(this._state,
			target, effect, startX, startY);
		data.setDestroyCallback(this.onBulletDestroyHandler.bind(this));
		this._collection.push(data);
		this._onBulletSpawned.dispatch(data);
	}

	public onBulletDestroyHandler(data: BasicBulletData): void {
		let index = this._collection.indexOf(data);
        this._collection.splice(index, 1);
		// this._collection = this._collection.slice(index, 1);
		this._onBulletDestroyed.dispatch(data);
		data.destroy();
	}

	public get collection(): BasicBulletData[] {
		return this._collection;
	}

	public get onBulletSpawned(): Signal {
		return this._onBulletSpawned;
	}

	public get onBulletDestroyed(): Signal {
		return this._onBulletDestroyed;
	}

	public destroy(): void {
		this._state = null;
		for (let i: number = 0; i < this._collection.length; i++) {
			this._collection[i].destroy();
			this._collection[i] = null;
		}
		this._onBulletDestroyed.removeAll();
		this._onBulletDestroyed = null;
		this._onBulletSpawned.removeAll();
		this._onBulletSpawned = null;
	}
}