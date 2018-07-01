import { PlayState } from "./playState";
import BaseCreepData from "./baseCreepData";
import Config from "./config";
import { IEffect, IGameObj } from "./interfaces";
import Signal from "./Signal";
import KPoint from "./KPoint";
import Vec2 from "./vec2";
import Pools from "./pools";
import ObjType from "./objType";
import { Guid } from "guid-typescript";
import EffectType from "./effectType";

export default class BasicBulletData implements IGameObj {
	public type: string;
	private _state: PlayState;
	private _x: number;
	private _y: number;
	private _target: BaseCreepData;
	private _speed: number = Config.TILE_SIZE * Config.BULLET_SPEED;
	private _effect: IEffect;
	private _isDead: boolean = false;
	private _uid: string;
	private _onDestroyCallback: Function;

	constructor(state: PlayState, target: BaseCreepData, effect: IEffect, startX: number, startY: number) {
		this._state = state;
		this._effect = effect;
		this._target = target;
		this._x = startX;
		this._y = startY;
		this._uid = Guid.create().toString();
	}

	public setDestroyCallback(callback: Function): void {
		this._onDestroyCallback = callback;
	}

	public getGuid() {
		return this._uid;
	}

	public getType() {
		return ObjType.Bullet;
	}

	public get y(): number {
		return this._y;
	}

	public set y(value: number) {
		this._y = value;
	}

	public get x(): number {
		return this._x;
	}

	public set x(value: number) {
		this._x = value;
	}

	public kill(): void {
		if (this._isDead) {
			// console.error("trying to kill dead bullet");
			return;
		}

		this._effect.execute(this._target);
		this._onDestroyCallback(this);
		this._isDead = true;
	}

	public destroy(): void {
		this._state = null;
		this._target = null;
		this._effect = null;
	}

	public advanceTime(time: number): void {
		if (this._target == null || this._target.isDead) {
			this.kill();
			return;
		}
		if (this._isDead)
			return;
		let frameDistance: number = this._speed * time;
		this.moveToTarget(frameDistance);
	}

	private moveToTarget(distance: number): void {
		let vec: Vec2 = new Vec2();
		vec.x = this._target.x - this.x;
		vec.y = this._target.y - this.y;

		let destroyDistance: number = Config.MIN_BULLET_DESTROY_DISTANCE;
		if (vec.length < destroyDistance)
			this.kill();
		if (vec.length > distance) {
			vec.normalizeSelf(distance);
		}
		else {
			this.kill();
		}
		this.x += vec.x;
		this.y += vec.y;
	}

	public get depth(): number {
		return this._state.map.getTileByCoords(this.x, this.y).getDepth();
	}

	public get effect(): IEffect {
		return this._effect;
	}

	public get effectType(): EffectType {
		return this._effect.getType();
	}
}