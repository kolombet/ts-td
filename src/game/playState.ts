import Starling from "starling/core/Starling";
import Button from "starling/display/Button";
import Image from "starling/display/Image";
import Sprite from "starling/display/Sprite";
import TouchEvent from "starling/events/TouchEvent";
import TouchPhase from "starling/events/TouchPhase";
import TextField from "starling/text/TextField";

import Align from "starling/utils/Align";
import Signal from "./Signal";
import { Guid } from "guid-typescript";
import MapData from "./mapData";
import BaseMode from "./baseMode";
import TileData from "./tileData";
import Config from "./config";
import Console from "./console";
import KPoint from "./KPoint";
import Pools from "./pools";
import IsoTransform from "./isoTransform";
import App from "./app";
import { IAnimatable, IDestroyable, IGameObj, ITowerStrategy, IEffect, IPassModel } from "./interfaces";
import TowerManager from "./towerManager";
import WaveManager from "./waveManager";
import CreepManager from "./creepManager";
import BulletManager from "./bulletManager";
import BaseCreepData from "./baseCreepData";
import EditorMode from "./editorMode";
import BuildTowerMode from "./buildTowerMode";
import PassModel from "./passModel";
import NormalMode from "./normalMode";
import FloodPassModel from "./floodPassModel";
import TowerSelectedMode from "./towerSelectedMode";
import BaseTowerData from "./baseTowerData";

export class PlayState implements IAnimatable, IDestroyable {
    private _passModel: IPassModel;
    private _map: MapData;
    private _previousTick: number = 0;
    private _currentTick: number = 0;
    private _towerManager: TowerManager;
    private _creepManager: CreepManager;
    private _bulletManager: BulletManager;
    private _waveManager: WaveManager;
    private _currentMode: BaseMode;
    private _lives: number;
    private _money: number;
    private _modeActivated: Signal = new Signal(BaseMode);
    private _onMoneyChanged: Signal = new Signal(Number);
    private _onLivesChanged: Signal = new Signal(Number);
    private _onGameEnded: Signal = new Signal();
    private _onLevelWin: Signal = new Signal();
    private _levelID: number;
    private _isDestroyed: boolean = false;
    private _uid: string;
    private _tick: Signal = new Signal();

    constructor(levelID: number) {
        // this._uid = UIDUtil.createUID();
        this._uid = Guid.create().toString();
        //console.log("_uid " + this._uid);
        this._levelID = levelID;
        this._lives = Config.START_LIVES_COUNT;
        this._money = Config.START_MONEY_COUNT;
        this._towerManager = new TowerManager(this);
        this._creepManager = new CreepManager(this);
        this._bulletManager = new BulletManager(this);
        this._waveManager = new WaveManager(this);
        // let waveData:Object = App.resources.assets.getObject(Config.WAVE_RES + this._levelID);



        // let waveDataRaw = App.resources.assets.getObject(Config.WaveRes);
        // let waveData = JSON.parse(waveDataRaw);
        // this._waveManager.load(waveData["data"]);

        this._waveManager.loadData();

        if (Config.DEBUG_WAVE_AUTOSTART)
            this._waveManager.initWave(0);

        this._map = new MapData(this);
        // this._map.initDummy();
        let mapDataRaw = App.resources.assets.getObject(Config.LevelRes);
        let mapData = JSON.parse(mapDataRaw);
        this._map.load(mapData);


        // this._passModel = new PassModel();
        this._passModel = new FloodPassModel();
        this._passModel.init(this._map.data);
        this._map.calculateRoads(this._passModel);


    }

    public init(): void {
        this.activateNormal();
        this._creepManager.onCreepPassed.add(this.onCreepPassedHandler.bind(this));
        this._towerManager.onTowerUpgradeRequest.add(tower => {
            this.activateTowerSelected(tower);
        });
        this.towerManager.findAllBasements();
        //console.log("Level started: " + this._levelID + " uid: " + this._uid);
    }

    private onCreepPassedHandler(creep: BaseCreepData): void {
        this.lives--;
        if (this.lives <= 0) {
            Starling.current.juggler.delayCall(() => {
                this._onGameEnded.dispatch();
            }, .1);
        }
    }

    public advanceTime(time: number): void {
        if (this._isDestroyed)
            return;

        this._towerManager.advanceTime(time);
        this._creepManager.advanceTime(time);
        this._bulletManager.advanceTime(time);
        this._waveManager.advanceTime(time);

        this._currentTick = Starling.current.juggler.elapsedTime / Config.TICK_TIME;
        if (this._previousTick != this._currentTick) {
            this._previousTick = this._currentTick;
            this.onTick();
        }
    }

    private onTick(): void {
        this._tick.dispatch();
    }

    public get map(): MapData {
        return this._map;
    }

    public get passModel(): IPassModel {
        return this._passModel;
    }

    public get towerManager(): TowerManager {
        return this._towerManager;
    }

    public set map(value: MapData) {
        this._map = value;
    }

    public get creepManager(): CreepManager {
        return this._creepManager;
    }

    public get bulletManager(): BulletManager {
        return this._bulletManager;
    }

    public activateEditor(): void {
        //console.log("activateEditor");
        this.deactivatePrevMode();
        this._currentMode = new EditorMode();
        this._currentMode.activate(this, null);
        this._modeActivated.dispatch(this._currentMode);
        // this.activateMode(EditorMode)
    }

    public activateNormal(): void {
        //console.log("activateNormal");
        this.deactivatePrevMode();
        this._currentMode = new NormalMode();
        this._currentMode.activate(this, null);

        this._modeActivated.dispatch(this._currentMode);
        // this.activateMode(NormalMode);
    }

    public activateTowerSelected(tower:BaseTowerData):void {
        this.deactivatePrevMode();
        this._currentMode = new TowerSelectedMode();
        this._currentMode.activate(this, tower);
        this._modeActivated.dispatch(this._currentMode);
    }

    public activateBuild(towerFactory: Function): void {
        this.deactivatePrevMode();
        this._currentMode = new BuildTowerMode();
        this._currentMode.activate(this, towerFactory);
        this._modeActivated.dispatch(this._currentMode);
    }

    private deactivatePrevMode(): void {
        if (this._currentMode != null) {
            this._currentMode.deactivate();
            this._currentMode = null;
        }
    }

    public get modeActivated(): Signal {
        return this._modeActivated;
    }

    public get currentMode(): BaseMode {
        return this._currentMode;
    }

    public get money(): number {
        return this._money;
    }

    public set money(value: number) {
        this._money = value;
        this._onMoneyChanged.dispatch(this._money);
    }

    public get lives(): number {
        return this._lives;
    }

    public set lives(value: number) {
        this._lives = value;
        this._onLivesChanged.dispatch(this._lives);
        if (this._lives < 0) {
            this._onGameEnded.dispatch();
        }
    }

    public get onMoneyChanged(): Signal {
        return this._onMoneyChanged;
    }

    public get onLivesChanged(): Signal {
        return this._onLivesChanged;
    }

    public get onGameEnded(): Signal {
        return this._onGameEnded;
    }

    public get levelID(): number {
        return this._levelID;
    }

    public get waveManager(): WaveManager {
        return this._waveManager;
    }

    public destroy(): void {
        //console.log("Destroying game world " + this._uid);
        this._creepManager.onCreepPassed.remove(this.onCreepPassedHandler);
        this._isDestroyed = true;
        this._passModel.destroy();
        this._passModel = null;
        this._map.destroy();
        this._map = null;
        this._towerManager.destroy();
        this._towerManager = null;
        this._creepManager.destroy();
        this._creepManager = null;
        this._bulletManager.destroy();
        this._bulletManager = null;
        this._waveManager.destroy();
        this._waveManager = null;
        this._currentMode.deactivate();
        this._currentMode = null;
        this._modeActivated.removeAll();
        this._modeActivated = null;
        this._onMoneyChanged.removeAll();
        this._onMoneyChanged = null;
        this._onLivesChanged.removeAll();
        this._onLivesChanged = null;
        this._onGameEnded.removeAll();
        this._onGameEnded = null;
        this._onLevelWin.removeAll();
        this._onLevelWin = null;
    }

    public get uid(): string {
        return this._uid;
    }

    public get onLevelWin(): Signal {
        return this._onLevelWin;
    }

    public get tick(): Signal {
        return this._tick;
    }
}

export default PlayState;