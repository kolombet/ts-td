import Signal from "./Signal";
import Config from "./config";
import {IAnimatable, IDestroyable, IGameObj, ITowerStrategy, IEffect} from "./interfaces";
import PlayState from "./playState";
import WaveData from "./waveData";

export default class WaveManager implements IAnimatable, IDestroyable {
    private _state: PlayState;
    private _waves: WaveData[];
    private _currentWave: WaveData;
    private _creepsRemained: number;
    private _spawnCooldown: number;
    private _waveDelay: number;
    private _waitingForWave: boolean;
    private _creepsToKillChanged: Signal = new Signal();//Int
    private _timeToNextWave: Signal = new Signal(Number);

    constructor(state: PlayState) {
        this._state = state;
        this._waves = [];
        this._waveDelay = 0;
        this._waitingForWave = false;
    }

    public loadData():WaveData[] {
        let waves = [];
        for (let i = 0; i < 100; i++) {
            waves.push(WaveData.create(10, 10*i, 1, 1, 5*i));
        }
        // waves.push(WaveData.create( 10, 10, 1, 1, 1));
        // waves.push(WaveData.create( 1, 100, 1, 1, 1));
        // waves.push(WaveData.create( 1, 100, 1, 1, 1));
        // waves.push(WaveData.create( 1, 100, 1, 1, 1));
        // waves.push(WaveData.create( 1, 100, 1, 1, 1));
        // waves.push(WaveData.create( 1, 100, 1, 1, 1));
        // waves.push(WaveData.create( 1, 100, 1, 1, 1));
        // waves.push(WaveData.create( 1, 100, 1, 1, 1));

        this._waves = waves;
        return waves;
    }

    // public load(data: Object): void {
    //     let waves: any[] = data as any[];
    //     for (let i: number = 0; i < waves.length; i++) {
    //         let wave: WaveData = new WaveData();
    //         wave.init(waves[i]);
    //         this._waves.push(wave);
    //     }
    // }

    public initWave(waveID: number): void {
        if (waveID > this._waves.length) {
            this._state.onLevelWin.dispatch();
            return;
        }
        this._currentWave = this._waves[waveID];
        this._creepsRemained = this._currentWave.count;
        this._spawnCooldown = this._currentWave.spawnDelay;
    }

    public advanceTime(time: number): void {
        if (this._waitingForWave) {
            let creepsToKill: number = this._state.creepManager.aliveCreepCount();
            if (creepsToKill > 0) {
                this.creepsToKillChanged.dispatch(creepsToKill);
                return;
            }

            if (this._waveDelay > 0) {
                this.timeToNextWave.dispatch(this._waveDelay);
                this._waveDelay -= time;
            }
            else {
                this._waitingForWave = false;
                this.initWave(this._currentWave.id + 1);
                //console.log("init wave " + this._currentWave.id);
            }
            return;
        }

        this._spawnCooldown -= time;
        if (this._spawnCooldown <= 0) {
            if (this._creepsRemained <= 0) {
                this._waveDelay = Config.WAVE_DELAY;
                this._waitingForWave = true;
            }
            else {
                this._state.creepManager.spawnCreep(this._currentWave);
                this._creepsRemained--;
                this._spawnCooldown = this._currentWave.spawnDelay;
            }
        }
    }

    public get creepsToKillChanged(): Signal {
        return this._creepsToKillChanged;
    }

    public get timeToNextWave(): Signal {
        return this._timeToNextWave;
    }

    public destroy(): void {
        this._state = null;
        for (let i: number = 0; i < this._waves.length; i++) {
            this._waves[i].destroy();
            this._waves[i] = null;
        }
        this._currentWave.destroy();
        this._currentWave = null;
        this._creepsToKillChanged.removeAll();
        this._creepsToKillChanged = null;
        this._timeToNextWave.removeAll();
        this._timeToNextWave = null;
    }
}