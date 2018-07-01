import Sprite from "starling/display/Sprite";
import TouchEvent from "starling/events/TouchEvent";
import TouchPhase from "starling/events/TouchPhase";
import { IDestroyable } from "./interfaces";
import { PlayState } from "./playState";
import KButton from "./kbutton";
import BaseMode from "./baseMode";
import EditorMode from "./editorMode";
import NormalMode from "./normalMode";
import Util from "./util";
import App from "./app";
import { TowerFactory } from "./towerFacotry";

export default class DebugUI extends Sprite implements IDestroyable {
    private _state: PlayState;
    private _moneyButton: KButton;
    private _livesButton: KButton;
    private _saveMapBtn: KButton;
    private _editorModeBtn: KButton;
    private _buildSimpleTower: KButton;
    private _buildAoeTower: KButton;
    private _buildFrostTower: KButton;
    private _normalModeBtn: KButton;
    private _restartGame: KButton;
    private _waveTimerBtn: KButton;
    private _buttons: any[];
    private _staticButtons: Sprite;
    private _debugButton: KButton;

    public init(state: PlayState): void {
        this._debugButton = new KButton(20, 20);
        this._debugButton.label = "x";
        this._debugButton.addEventListener(TouchEvent.TOUCH, this.onTouch.bind(this));
        this.addChild(this._debugButton);


        this._staticButtons = new Sprite();

        this._state = state;
        this._moneyButton = new KButton();
        this.setMoney(state.money);
        this._livesButton = new KButton();
        this.setLives(state.lives);
        this._saveMapBtn = new KButton();
        this._saveMapBtn.label = "save map";
        this._editorModeBtn = new KButton();
        this._editorModeBtn.label = "editor mode";
        this._normalModeBtn = new KButton();
        this._normalModeBtn.label = "normal mode";
        this._buildSimpleTower = new KButton();
        this._buildSimpleTower.label = "build tower";
        this._buildAoeTower = new KButton();
        this._buildAoeTower.label = "build aoe tower";
        this._buildFrostTower = new KButton();
        this._buildFrostTower.label = "build frost tower";
        this._restartGame = new KButton();
        this._restartGame.label = "restart game";
        this._waveTimerBtn = new KButton();

        this._buttons = [
            this._waveTimerBtn, this._moneyButton, this._livesButton, this._saveMapBtn, this._editorModeBtn, this._normalModeBtn, this._buildSimpleTower,
            this._buildAoeTower, this._buildFrostTower, this._restartGame,
        ];
        for (let i: number = 0; i < this._buttons.length; i++) {
            let b: KButton = this._buttons[i];
            b.y = 50 + i * 30;
            b.addEventListener(TouchEvent.TOUCH, this.onTouch.bind(this));
            this._staticButtons.addChild(b);
        }

        this._staticButtons.visible = false;
        this.addChild(this._staticButtons);

        state.modeActivated.add(this.onModeChanged.bind(this));
        state.onMoneyChanged.add(this.onMoneyChanged.bind(this));
        state.onLivesChanged.add(this.onLivesChanged.bind(this));
        state.waveManager.timeToNextWave.add(this.onTimeToNextWaveChanged.bind(this));
        state.waveManager.creepsToKillChanged.add(this.onCreepsToKillChanged.bind(this));
        state.onLevelWin.add(this.onGameWinHandler.bind(this));
        state.onGameEnded.add(this.onGameEndedHandler.bind(this));

        // this.addChild(new UpgradeView(this._state));
    }

    private onGameEndedHandler(): void {
        this._waveTimerBtn.label = "You loose";
    }

    private onGameWinHandler(): void {
        this._waveTimerBtn.label = "You win";
    }

    private onCreepsToKillChanged(count: number): void {
        this._waveTimerBtn.label = "Creeps alive: " + count;
    }

    private onTimeToNextWaveChanged(time: number): void {
        this._waveTimerBtn.label = "time to next wave: " + time.toFixed(1);
    }

    private onLivesChanged(value: number): void {
        this.setLives(value);
    }

    private onMoneyChanged(value: number): void {
        this.setMoney(value);
    }

    private setLives(value: number): void {
        this._livesButton.label = "Lives: " + value;
    }

    private setMoney(value: number): void {
        this._moneyButton.label = "Money: " + value;
    }

    private onModeChanged(mode: BaseMode): void {
        this._saveMapBtn.visible = (mode instanceof EditorMode);
        this._editorModeBtn.visible = !(mode instanceof EditorMode);
        this._normalModeBtn.visible = !(mode instanceof NormalMode);
    }

    private onTouch(event: TouchEvent): void {
        console.log("touch");
        let touch = event.getTouch(this);
        if (touch == null)
            return;

        if (touch.phase == TouchPhase.ENDED) {
            if (event.target == this._debugButton) {
                console.log("visible " + this._staticButtons.visible);
                this._staticButtons.visible = !this._staticButtons.visible;
            }

            if (event.target == this._saveMapBtn) {
                this.saveMap();
            }
            else if (event.target == this._editorModeBtn) {
                //console.log("editor mode button");
                this._state.activateEditor();
            }
            else if (event.target == this._buildSimpleTower) {
                this._state.activateBuild(TowerFactory.createBasicTower);
            }
            else if (event.target == this._buildAoeTower) {
                this._state.activateBuild(TowerFactory.createAOETower);
            }
            else if (event.target == this._buildFrostTower) {
                this._state.activateBuild(TowerFactory.createFrostTower);
            }
            else if (event.target == this._normalModeBtn) {
                this._state.activateNormal();
            }
            else if (event.target == this._restartGame) {
                App.instance.restartLevel();
            }
            else if (event.target == this._moneyButton) {
                this._state.money += 500;
            }
            else if (event.target == this._livesButton) {
                this._state.lives += 50;
            }

        }
    }

    private saveMap(): void {
        const save = App.instance.state.map.save();
        // let save: Object = this._state.map.save();
        let saveStr: string = JSON.stringify(save);

        Util.outFile("level.json", saveStr);
    }

    public destroy(): void {
        this._state.modeActivated.remove(this.onModeChanged);
        this._state.onMoneyChanged.remove(this.onMoneyChanged);
        this._state.onLivesChanged.remove(this.onLivesChanged);
        this._state.waveManager.timeToNextWave.remove(this.onTimeToNextWaveChanged);
        this._state.waveManager.creepsToKillChanged.remove(this.onCreepsToKillChanged);
        this._state.onLevelWin.remove(this.onGameWinHandler);
        this._state.onGameEnded.remove(this.onGameEndedHandler);
        this._state = null;
        this.removeChildren();
        this._staticButtons.removeChildren();
        this._staticButtons = null;
        for (let i: number = 0; i < this._buttons.length; i++) {
            this._buttons[i].dispose();
            this._buttons[i] = null;
        }

    }
}