
import Starling from "starling/core/Starling";
import Sprite from "starling/display/Sprite";
import Console from "./console";
import Pools from "./pools";
import { IAnimatable } from "./interfaces";
import PlayState from "./playState";
import GameView from "./gameView";
import CellGraphics from "./cellGraphics";
import Resources from "./resources";
import AssetManager from "starling-framework/lib/starling/utils/AssetManager";
import test from "./unittests";
import Config from "./config";

export default class App extends Sprite implements IAnimatable {
    get state(): PlayState {
        return this._state;
    }
    get view(): GameView {
        return this._view;
    }
    public static resources: Resources;
    public static cells: CellGraphics;
    public static instance: App;

    private _state: PlayState;
    private _view: GameView;
    private _currentLevelID: number;
    private _isRecreating: boolean = false;

    constructor() {
        super();
        test();
    }

    public start(assets: AssetManager): void {
        App.resources = new Resources(assets);
        App.resources.init();

        this.init();
    }

    private init() {
        if (App.instance) {
            throw new Error("singleton error");
        }
        App.instance = this;
        window["App"] = this;
        // new MetalWorksDesktopTheme();

        new Pools();

        App.cells = new CellGraphics();

        // this.Main.loadProgress.parent.removeChild(this.Main.loadProgress);
        // this.Main.loadProgress = null;

        this._currentLevelID = 0;
        //console.log("load level");
        App.resources.loadLevel(this._currentLevelID, this.onLevelLoaded.bind(this));

        // KeyHelper.init(Starling.current.nativeStage);
        // KeyHelper.add(Keyboard.R, this.restartLevel);
        // KeyHelper.add(Keyboard.S, this.increaseGameSpeed);
        Starling.current.juggler.timeScale = Config.GAME_SPEED_MULTIPLIER;

        // GameSpeedController.initialize();
        Starling.current.juggler.add(this);

        Starling.current.showStats = true;
    }

    public updateScale(canvasWidth:number, canvasHeight:number):void {
        let stageScaleX = canvasWidth / Config.GameWidth;
        let stageScaleY = canvasHeight / Config.GameHeight;

        let stageScale:number = Math.min(stageScaleX, stageScaleY);
        this._view.scalableScene.scale = stageScale;
        this._view.background.scale = stageScale;
        console.log("updateScalableScene size " + this._view.scalableScene.x);

        this._view.setSceneShift(Config.SCENE_SHIFT, stageScale);
    }

    private increaseGameSpeed(): void {
        // Starling.speedMultiplier = 100;
    }

    private onLevelLoaded(): void {
        //console.log("level " + this._currentLevelID + " loaded");
        this.startLevel(this._currentLevelID);
    }

    public clearLevel(): void {
        this._isRecreating = true;
        if (this._view != null) {
            this._view.destroy();
            this._view = null;
        }
        if (this._state != null) {
            this._state.destroy();
            this._state = null;
        }
    }

    public restartLevel(): void {
        this.clearLevel();
        this.startLevel(this._currentLevelID);
    }

    public startLevel(levelID: number): void {
        this._state = new PlayState(levelID);
        this._state.onGameEnded.addOnce(this.onGameEndedHandler.bind(this));
        this._view = new GameView(this);
        this._view.load(this._state);
        this._state.init();

        this._isRecreating = false;
    }

    private onGameEndedHandler(): void {
        this.clearLevel();
        this.startLevel(this._currentLevelID);
    }

    public static getScene(): Sprite {
        return App.instance._view.scalableScene;
    }

    public advanceTime(time: number): void {
        if (this._isRecreating == true)
            return;

        if (this._state) {
            this._state.advanceTime(time);
        }
        if (this._view) {
            this._view.advanceTime(time);
        }
    }
}
