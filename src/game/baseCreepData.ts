import Signal from "./Signal";
import {IAnimatable, IDestroyable, IGameObj} from "./interfaces";
import PlayState from "./playState";
import TileData from "./tileData";
import TileType from "./tileType";
import Config from "./config";
import Console from "./console";
import Vec2 from "./vec2";
import WaveData from "./waveData";
import Pools from "./pools";
import Direction from "./direction";
import Util from "./util";
import KPoint from "./KPoint";
import IsoTransform from "./isoTransform";
import ObjType from "./objType";
import {Guid} from "guid-typescript";

export default class BaseCreepData implements IGameObj {
    get isDead(): boolean {
        return this._isDead;
    }

    private _speed: number;
    private _path: TileData[];
    private _currentTile: TileData;
    private _currentNode: number = 0;
    private _rangeToBase: number = 0;
    private _hp: number;
    private _maxHp: number;
    private _id: number;
    private _x: number;
    private _y: number;
    private _state: PlayState;
    private _isFrozen: boolean;
    private _frozenDuration: number;
    private _frozenModifier: number;
    private _sector: number;
    private _rotationName: string;
    private _moveVector: Vec2;
    private _onCreepKilled: Signal = new Signal(BaseCreepData);
    private _onCreepPassed: Signal = new Signal(BaseCreepData);
    private _reward: number;
    private _isDead: boolean;
    private _uid: string;

    constructor(state: PlayState, wave: WaveData, creepId: number, path: TileData[]) {
        this._moveVector = new Vec2();
        this._hp = wave.health;
        this._maxHp = wave.health;
        this._speed = wave.speed * Config.TILE_SIZE;
        this._reward = wave.reward;
        this._state = state;
        this._id = creepId;
        this._path = path;
        this._uid = Guid.create().toString();
        //console.log("creep data init");
    }

    public getHealthRatio() {
        if (this._maxHp == 0)
            return 1;
        return this.hp / this._maxHp;
    }

    public getGuid(): string {
        return this._uid;
    }

    getType() {
        return ObjType.Creep;
    }

    public advanceTime(time: number): void {
        let frameDistance: number = this._speed * time;
        if (this._isFrozen) {
            frameDistance = frameDistance * this._frozenModifier;
            if (this._frozenDuration > 0) {
                this._frozenDuration -= time;
            }
            else {
                this._isFrozen = false;
            }
        }
        // //console.log("move to target " + frameDistance);
        // this.moveToTarget(frameDistance);
        // this.x = this._path[0].cx;
        // this.y = this._path[0].cy;
        // this.x = this.x += 0.1 * time;
        // this.y = this.y += 0.1 * time;
        // this.x = 100;
        // this.y = 100;

        this.moveToTargetOld(frameDistance);
    }

    private moveToTarget(distance: number): void {
        this._currentTile = this._path[this._currentNode];

        let vec: Vec2 = new Vec2();
        vec.x = this._currentTile.cx - this.x;
        vec.y = this._currentTile.cy - this.y;
        let len = vec.getLength();
        if (len > distance) {
            let vec2 = vec.normalizeSelf(distance);
            let vx = vec2.x;
            let vy = vec2.y;
            this.x += vx;
            this.y += vy;
            // //console.log(` move vec: ${vec.toString()} normalized ${vec2.toString()}`);
        } else {
            this._currentNode++;
            // //console.log("current node ++ ")
            return;
        }


    }

    private round(value: number, x: number = 2, base: number = 10): number {
        // return Number(Math.round(parseFloat(value + 'e' + decimals)) + 'e-' + decimals);
        const pow = Math.pow(base || 10, x);
        return +(Math.round(value * pow) / pow);
    }

    private moveToTargetOld(distance: number): void {
        // distance =  this.round(distance);
        // distance = 0.5;
        if (this._path == null || this._isDead)
            return;

        if (this._currentNode > this._path.length - 1) {
            this._isDead = true;
            this._onCreepPassed.dispatch(this);
            return;
        }
        this._currentTile = this._path[this._currentNode];

        let moveVector: Vec2 = Pools.vec2.object;
        moveVector.x = this.round(this._currentTile.cx - this.x);
        moveVector.y = this.round(this._currentTile.cy - this.y);
        // if (this._moveVector.equals(moveVector) == false) {
        //     this._moveVector = moveVector;
        //     if (moveVector.length > 0) {
        //         let faceVec: Vec2 = IsoTransform.from(moveVector);
        //         this.updateRotation(faceVec);
        //     }
        // }

        if (moveVector.length > distance) {
            // console.log("distance " + distance);
            moveVector.normalizeSelf(distance);
            // moveVector.x = this.round(moveVector.x);
            // moveVector.y = this.round(moveVector.y);

            if (this._moveVector.equals(moveVector) == true) {
                // console.log("move vector same");
            } else {
                // console.log("move vector " + moveVector.toString());
            }
            this._moveVector = moveVector;
        }
        else {
            this._currentNode++;
            return;
            // let len = moveVector.getLength();
            // let remains: number = distance - len;
            // moveVector.normalizeSelf(remains);
            // if (isNaN(remains)) {
            //console.log("ERROR: got NaN")
            // }
            // this.moveToTargetOld(remains);
            // return;
            ////console.log("move to target " + remains);
        }
        // console.log("this.x " + this.x);
        // this.x += moveVector.x;
        // this.y += moveVector.y;
        this.x = this.round(this.x + moveVector.x, 0);
        this.y = this.round(this.y + moveVector.y, 0);
    }

    private updateRotation(vec: Vec2): void {
        let angle: number = vec.getDegrees();
        let sector: number = Math.round((vec.getRads() + Math.PI) / (Math.PI / 4));
        if (sector > Direction.directionList.length)
            throw new Error("rot not found");
        if (this._sector != sector) {
            this._sector = sector;
            this._rotationName = Direction.directionList[sector];
        }
    }

    public destroy(): void {
        this._path = null;
        this._onCreepKilled.removeAll();
        this._onCreepPassed.removeAll();
        this._onCreepKilled = null;
        this._onCreepPassed = null;
    }

    public calculateRangeToBase(state: PlayState): void {
        let base: TileData = state.map.base;
        let dx: number = base.cx - this.x;
        let dy: number = base.cy - this.y;
        this._rangeToBase = Util.vecLength(dx, dy);
    }

    public calculateRangeTo(target: KPoint): number {
        return Util.vecLength(target.x - this.x, target.y - this.y);
    }

    public get rangeToBase(): number {
        return this._rangeToBase;
    }

    public get id(): number {
        return this._id;
    }

    public get hp(): number {
        return this._hp;
    }

    public hit(value: number): void {
        if (this._hp < 0 || this._isDead)
            return;

        this._hp -= value;
        // console.log("creep " + this.id + " hit, hp value: " + this._hp);
        if (this._hp <= 0) {
            //console.log("creep " + this.id + " is killed");
            this._isDead = true;
            this._onCreepKilled.dispatch(this);
        }
    }

    public get x(): number {
        return this._x;
    }

    public set x(value: number) {
        this._x = value;
    }

    public get y(): number {
        return this._y;
    }

    public set y(value: number) {
        this._y = value;
    }

    public get state(): PlayState {
        return this._state;
    }

    public applyFreeze(duration: number, modifier: number): void {
        this._isFrozen = true;
        this._frozenDuration = duration;
        this._frozenModifier = modifier;
    }

    public get rotationName(): string {
        return this._rotationName;
    }

    public get onCreepKilled(): Signal {
        return this._onCreepKilled;
    }

    public get onCreepPassed(): Signal {
        return this._onCreepPassed;
    }

    public get reward(): number {
        return this._reward;
    }

    public get depth(): number {
        if (this._currentTile == null) {
            return 0;
        }
        return this._currentTile.getDepth();
    }
}