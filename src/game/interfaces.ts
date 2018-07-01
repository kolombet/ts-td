import BaseTowerData from "./baseTowerData";
import BaseCreepData from "./baseCreepData";
import PlayState from "./playState";
import objType from "./objType";
import DisplayObject from "starling/display/DisplayObject";
import ModeType from "./modeType";
import TileData from "./tileData";
import InteractiveObject from "openfl/lib/openfl/display/InteractiveObject";
import EffectType from "./effectType";

export interface IDestroyable {
    destroy(): void;
}

export interface IAnimatable {
    advanceTime(time: number): void;
}

export interface ISaveLoadable {
    save(): Object;
    load(data: Object): void;
}

export interface IGameObj extends IAnimatable {
    x: number;

    y: number;

    depth: number;

    destroy(): void;

    getType(): objType;

    getGuid(): string;
}

export interface IPoint {
    x: number;
    y: number;
}

export interface ITowerStrategy {
    find(tower: BaseTowerData): BaseCreepData
}

export interface IEffect {
    execute(target: BaseCreepData): void;
    getType(): EffectType;
    getValue(): number;
}

export interface IMode {
    activate(state: PlayState, data: any): void;
    deactivate(): void;
    // getType():ModeType;
}

export interface IGameView extends IAnimatable, IDestroyable, DisplayObject {
    getData(): IGameObj;
    getGuid(): string;
}

export interface IPassModel extends IDestroyable {
    getPath(startTile: TileData, endTile: TileData): TileData[];
    init(grid: Array<Array<TileData>>): void;
}