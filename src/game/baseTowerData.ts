import Signal from "./Signal";
import {IAnimatable, IDestroyable, IGameObj, ITowerStrategy, IEffect} from "./interfaces";
import PlayState from "./playState";
import TileData from "./tileData";
import TileType from "./tileType";
import BaseCreepData from "./baseCreepData";
import TowerState from "./towerState";
import Config from "./config";
import StrategyNearestToBase from "./strategyNearestToBase";
import KPoint from "./KPoint";
import ObjType from "./objType";
import {Guid} from "guid-typescript";
import {TowerType} from "./towerFacotry";
import NoDamage from "./noDamage";

export default class BaseTowerData implements IGameObj, IDestroyable {
    public get shootSpeed(): number {
        return this._shootSpeed;
    }

    public get y(): number {
        return this._y;
    }

    public get x(): number {
        return this._x;
    }

    public get coords(): KPoint {
        return new KPoint(this._x, this._y);
    }

    public get state(): PlayState {
        return this._state;
    }

    public get type(): string {
        return this._type;
    }

    public get radius(): number {
        return this._radius;
    }

    public get size(): number {
        return this._size;
    }

    public get price(): number {
        return this._price;
    }

    protected _type: string;
    protected _radius: number;
    protected _shootSpeed: number;
    protected _price: number;
    protected _shootCooldown: number = 0;
    protected _towerState: string;
    protected _state: PlayState;
    protected _currentEnemy: BaseCreepData;
    protected _x: number;
    protected _y: number;
    protected _findEnemyStrategy: ITowerStrategy;
    protected _effect: IEffect;
    protected _size: number;
    protected _tilesOccupied: TileData[];
    protected _uid: string;
    protected _towerType: TowerType;

    constructor(state: PlayState, effect: IEffect) {
        this._effect = effect;
        this._state = state;
        this._findEnemyStrategy = new StrategyNearestToBase();
        this._towerState = TowerState.IDLE;
        this._size = Config.TILE_SIZE * 3;
        this._uid = Guid.create().toString();
    }

    public getGuid() {
        return this._uid;
    }

    public getType() {
        return ObjType.Tower;
    }

    public advanceTime(time: number): void {
        if (this._shootCooldown > 0) {
            this._shootCooldown -= time;
            return;
        }
        this._currentEnemy = this._findEnemyStrategy.find(this);
        if (this._currentEnemy != null) {
            this._towerState = TowerState.ATTACK
        }
        else {
            this._towerState = TowerState.IDLE;
        }

        if (this._towerState == TowerState.ATTACK) {
            const passive = this._effect instanceof NoDamage;
            if (this._shootCooldown <= 0 && !passive) {
                this._shootCooldown += this._shootSpeed;
                this._state.bulletManager.spawn(this._currentEnemy,
                    this._effect, this._x, this._y);
            }
        }
    }


    public destroy(): void {
        this._towerState = null;
        this._state = null;
        this._currentEnemy = null;
        this._findEnemyStrategy = null;
        this._effect = null;
    }

    public set targetTiles(value: TileData[]) {
        value.forEach(function (tile: TileData) {
            tile.tileType = TileType.BUILDING;
        });
        this._tilesOccupied = value;
        // this._x = 0.25 * (value[0].cx + value[1].cx + value[2].cx + value[3].cx);
        // this._y = 0.25 * (value[0].cy + value[1].cy + value[2].cy + value[3].cy);
        this._x = value[0].cx;
        this._y = value[0].cy;
        console.log("CXCY")
    }

    public get targetTiles(): TileData[] {
        return this._tilesOccupied;
    }

    public get depth(): number {
        let depths = this._tilesOccupied[0].getDepth() +
            this._tilesOccupied[1].getDepth() +
            this._tilesOccupied[2].getDepth() +
            this._tilesOccupied[3].getDepth();
        return depths / 4;
    }

    public get effect(): IEffect {
        return this._effect;
    }
}
