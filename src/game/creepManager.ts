import Signal from "./Signal";
import { IDestroyable } from "./interfaces";
import { PlayState } from "./playState";
import BaseCreepData from "./baseCreepData";
import Console from "./console";
import WaveData from "./waveData";
import TileData from "./tileData";

export default class CreepManager implements IDestroyable {
	private _state: PlayState;
	private _creepID: number = 0;
	private _collection: BaseCreepData[];
	private _onCreepSpawned: Signal = new Signal(BaseCreepData);
	private _onCreepKilled: Signal = new Signal(BaseCreepData);
	private _onCreepPassed: Signal = new Signal(BaseCreepData);

	constructor(state: PlayState) {
		this._state = state;
		this._collection = new Array<BaseCreepData>();
	}

	public advanceTime(time: number): void {
		if (this._collection == null) {
			//console.log("error");
			return;
		}
		for (let i: number = 0; i < this._collection.length; i++) {
			this._collection[i].advanceTime(time);
		}
	}

	public spawnCreep(wave: WaveData): void {
		let path: TileData[] = this._state.map.path;

		let creepData: BaseCreepData = new BaseCreepData(this._state, wave, this._creepID, path);
		this._creepID++;
		creepData.x = path[0].cx;
		creepData.y = path[0].cy;
		this._collection.push(creepData);
		this._onCreepSpawned.dispatch(creepData);
		creepData.onCreepKilled.addOnce(this.onCreepKilledHandler.bind(this));
		creepData.onCreepPassed.addOnce(this.onCreepPassedHandler.bind(this));
	}

	private onCreepKilledHandler(data: BaseCreepData): void {
		this._state.money += data.reward;
		this._onCreepKilled.dispatch(data);
		this.removeCreep(data);
		//console.log("killed creep id: " + data.id);
	}

	private onCreepPassedHandler(data: BaseCreepData): void {
		this._onCreepPassed.dispatch(data);
		this.removeCreep(data);
		//console.log("passed creep id: " + data.id)
	}

	private removeCreep(data: BaseCreepData): void {
		if (this._collection == null)
			return;
		let creepIndex: number = this._collection.indexOf(data);
		this._collection.splice(creepIndex, 1);
		data.destroy();
		//console.log("creeps remained: " + this.aliveCreepCount());
	}

	public get collection(): BaseCreepData[] {
		return this._collection;
	}

	public aliveCreepCount(): number {
		return this._collection.length;
	}

	public destroy(): void {
		this._state = null;
		for (let i: number = 0; i < this._collection.length; i++) {
			this._collection[i].destroy();
			this._collection[i] = null;
		}
		this._collection = null;
		this._onCreepSpawned.removeAll();
		this._onCreepSpawned = null;
		this._onCreepKilled.removeAll();
		this._onCreepKilled = null;
		this._onCreepPassed.removeAll();
		this._onCreepPassed = null;
	}

	public get onCreepSpawned(): Signal {
		return this._onCreepSpawned;
	}

	public get onCreepKilled(): Signal {
		return this._onCreepKilled;
	}

	public get onCreepPassed(): Signal {
		return this._onCreepPassed;
	}
}