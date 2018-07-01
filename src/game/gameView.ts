import Image from "starling/display/Image";
import Sprite from "starling/display/Sprite";
import DisplayObject from "starling/display/DisplayObject";
import BaseMode from "./baseMode";
import Config from "./config";
import { IAnimatable, IDestroyable, IGameView, IGameObj } from "./interfaces";
import PlayState from "./playState";
import GridView from "./gridView";
import CreepView from "./creepView";
import ObjType from "./objType";
import BaseTowerData from "./baseTowerData";
import BaseCreepData from "./baseCreepData";
import BasicBulletData from "./basicBulletData";
import BulletView from "./bulletView";
import TowerView from "./towerView";
import ShadowTowerView from "./shadowTowerView";
import ShadowTowerData from "./shadowTowerData";
import EditorMode from "./editorMode";
import BuildTowerMode from "./buildTowerMode";
import App from "./app";
import DebugUI from "./debugUI";
import UpgradeView from "./upgradeView";
import TowerStatView from "./towerStatView";


export default class GameView implements IAnimatable, IDestroyable {
    get gridView(): GridView {
        return this._gridView;
    }
    get scalableScene(): Sprite {
        return this._scene;
    }
    get background():Image {
        return this._background;
    }
    private _topView: Sprite;
    private _scene: Sprite;
    private _levelView: Sprite;
    private _state: PlayState;
    private _gridView: GridView;
    private _viewsD: Object;
    private _viewsV: IGameView[];
    private _background: Image;
    private _debugUI: DebugUI;
    private _currentMode: BaseMode;
    private _gameObjectsLayer: Sprite;
    private _shadowTower: ShadowTowerView;
    private _upgradeView: UpgradeView;
    private _towerStatView: TowerStatView;

    constructor(topView: Sprite) {
        this._topView = topView;
        this._viewsD = {};
        this._viewsV = [];
        this._scene = new Sprite();
        this._gameObjectsLayer = new Sprite();
        let mapTexture = App.resources.assets.getTexture(Config.Map);

        this._background = new Image(mapTexture);


        this._gridView = new GridView();
        this._debugUI = new DebugUI();

        this._levelView = new Sprite();

        this._topView.addChild(this._background);
        this._topView.addChild(this._scene);
        // this._background.height = 1900;
        // this._scene.addChild(this._background);
        // this._scene.addChild(App.resources.getTower2());
        // let anim = App.resources.getMonsterAnimation("gnome", "R");
        // this._scene.addChild(anim);

        this._levelView.addChild(this._gridView);
        this._levelView.addChild(this._gameObjectsLayer);
        this._upgradeView = new UpgradeView();
        this._levelView.addChild(this._upgradeView);
        this._scene.addChild(this._levelView);

        this._towerStatView =  new TowerStatView();
        this._topView.addChild(this._towerStatView);

        this._topView.addChild(this._debugUI);
    }

    private onModeActivated(mode: BaseMode): void {
        //console.log("on mode activated ");
        this._currentMode = mode;
        this._gridView.visible = mode instanceof EditorMode || mode instanceof BuildTowerMode;
        this._gridView.setMode(mode);
        this._gridView.updateGrid(this._state.map);

        if (this._shadowTower != null) {
            this.objectRemoved(this._shadowTower.getData());
            this._shadowTower = null;
        }
        if (mode instanceof BuildTowerMode) {
            let buildTowerMode = <BuildTowerMode>mode;
            this.objectAdded(buildTowerMode.shadowTowerData);
        }
    }

    private onMapDataChanged(): void {
        if (this._currentMode instanceof EditorMode || this._currentMode instanceof BuildTowerMode) {
            this._gridView.updateGrid(this._state.map);
        }
    }

    private objectAdded(obj: IGameObj): void {
        let view: IGameView;

        if (obj.getType() == ObjType.Tower) {
            view = new TowerView(obj as BaseTowerData);
        }
        else if (obj.getType() == ObjType.Creep) {
            view = new CreepView(obj as BaseCreepData);
        }
        else if (obj.getType() == ObjType.Bullet) {
            view = new BulletView(obj as BasicBulletData);
        }
        else if (obj.getType() == ObjType.ShadowTower) {
            view = new ShadowTowerView(obj as ShadowTowerData);
            //console.log("shadow tower created");
            this._shadowTower = <ShadowTowerView>view;
        }
        this._viewsV.push(view);
        this._viewsD[obj.getGuid()] = view;
        this._gameObjectsLayer.addChild(view as DisplayObject);
    }

    private objectRemoved(obj: IGameObj): void {
        if (this._viewsD == null) {
            console.error("_viewsD is dead WTF");
            return;
        }

        let view: IGameView = this._viewsD[obj.getGuid()];
        view.destroy();
        // this._viewsV.removeAt(this._viewsV.indexOf(view));
        //TODO removeAt
        let index = this._viewsV.indexOf(view);
        this._viewsV.splice(index, 1);
        // delete this._viewsD[obj.getGuid()];
        this._gameObjectsLayer.removeChild(<DisplayObject>view)
    }

    public clear(): void {
        this._state = null;
    }

    public advanceTime(time: number): void {
        for (let i: number = 0; i < this._viewsV.length; i++) {
            this._viewsV[i].advanceTime(time);
        }
    }

    private depthSort(): void {
        this._gameObjectsLayer.sortChildren(this.depthSortFunc);
    }

    private depthSortFunc(first: Object, second: Object): number {
        let f: IGameView = <IGameView>first;
        let s: IGameView = <IGameView>second;
        return (f.getData().depth > s.getData().depth) ? 1 : -1;
    }

    public load(state: PlayState): void {
        this._state = state;

        this._state.towerManager.onTowerDestroyed.add(this.objectRemoved.bind(this));
        this._state.towerManager.onTowerSpawned.add(this.objectAdded.bind(this));
        this._state.creepManager.onCreepSpawned.add(this.objectAdded.bind(this));
        this._state.creepManager.onCreepKilled.add(this.objectRemoved.bind(this));
        this._state.creepManager.onCreepPassed.add(this.objectRemoved.bind(this));
        this._state.bulletManager.onBulletSpawned.add(this.objectAdded.bind(this));
        this._state.bulletManager.onBulletDestroyed.add(this.objectRemoved.bind(this));
        this._state.map.onMapDataChanged.add(this.onMapDataChanged.bind(this));
        this._state.modeActivated.add(this.onModeActivated.bind(this));
        this._state.tick.add(this.depthSort.bind(this));
        this._upgradeView.init(state);

        this._debugUI.init(state);
        this._towerStatView.init(state);

        this._state.activateNormal();
        // this._state.activateEditor();
        // this._state.activateBuild(TowerFactory.createBasicTower);
    }

    public setSceneShift(value:number, scale:number) {
        this._scene.x = value * scale;
        // this._background.x  = -value * scale;
        // this._background.x = - value;
        // this._scene.x = -value
        // this._levelView.x = 2 * value;
    }

    public destroy(): void {
        this._state.towerManager.onTowerDestroyed.remove(this.objectRemoved);
        this._state.towerManager.onTowerSpawned.remove(this.objectAdded);
        this._state.creepManager.onCreepSpawned.remove(this.objectAdded);
        this._state.creepManager.onCreepKilled.remove(this.objectRemoved);
        this._state.creepManager.onCreepPassed.remove(this.objectRemoved);
        this._state.bulletManager.onBulletSpawned.remove(this.objectAdded);
        this._state.bulletManager.onBulletDestroyed.remove(this.objectRemoved);
        this._state.map.onMapDataChanged.remove(this.onMapDataChanged);
        this._state.modeActivated.remove(this.onModeActivated);
        this._state.tick.add(this.depthSort);

        this._topView.removeChildren();
        this._scene.removeChildren();
        this._gameObjectsLayer.removeChildren();
        this._debugUI.removeChildren();
        this._topView = null;
        this._scene = null;
        this._state = null;
        this._gridView.destroy();
        this._gridView = null;
        for (let i: number = 0; i < this._viewsV.length; i++) {
            this._viewsV[i].destroy();
            delete this._viewsV[i];
        }
        this._viewsD = null;
        this._viewsV = null;
        this._background.dispose();
        this._debugUI = null;
        this._currentMode = null;
        this._gameObjectsLayer = null;
    }
}
