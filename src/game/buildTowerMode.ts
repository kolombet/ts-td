import Sprite from "starling/display/Sprite";
import TouchEvent from "starling/events/TouchEvent";
import TouchPhase from "starling/events/TouchPhase";
import Touch from "starling/events/Touch";
import BaseMode from "./baseMode";
import TileData from "./tileData";
import Console from "./console";
import KPoint from "./KPoint";
import Pools from "./pools";
import IsoTransform from "./isoTransform";
import PlayState from "./playState";
import BaseTowerData from "./baseTowerData";
import ShadowTowerData from "./shadowTowerData";
import App from "./app";
import TileType from "./tileType";

export default class BuildTowerMode extends BaseMode {
    private _scene: Sprite;
    private _state: PlayState;
    private _currentPoint: KPoint;
    private _towerFactory: Function;
    private _shadowTowerData: ShadowTowerData;

    constructor() {
        super();
    }

    public onStageTouch(evt: TouchEvent): void {
        let touch: Touch = evt.getTouch(this._scene);
        if (touch) {
            switch (touch.phase) {
                case TouchPhase.BEGAN:
                    if (this._currentPoint == null)
                        return;
                    this.tryToBuild(this._shadowTowerData.buildTile);
                    break;

                case TouchPhase.ENDED:
                    break;

                case TouchPhase.MOVED:
                    break;

                case TouchPhase.HOVER:
                    let openflPoint = touch.getLocation(this._scene);
                    this._currentPoint = new KPoint(openflPoint.x, openflPoint.y);
                    let p: KPoint = IsoTransform.toP(this._currentPoint);
                    this._shadowTowerData.findNearestLocation(p.x, p.y);
                    break;
            }
        }
    }

    private tryToBuild(tile: TileData): void {
        if (tile != null && tile.tileType == TileType.BUILDSITE) {
            let tower: BaseTowerData = this._towerFactory(this._state);
            let res: boolean = this._state.towerManager.buildTowerByTile(tile, tower);
            if (res == true) {
                Console.debug("builded tower");
                this._state.activateNormal();
            }
            else {
                Console.debug("not builded");
            }
        }
    }

    /*override*/
    public activate(state: PlayState, data: Object = null): void {
        console.log("build tower mode activate");
        this._state = state;
        this._towerFactory = <Function>data;
        this._scene = App.getScene();
        this._scene.addEventListener(TouchEvent.TOUCH, this.onStageTouch.bind(this));
        this._shadowTowerData = new ShadowTowerData(this._state, this._towerFactory);
    }

    /*override*/
    public deactivate(): void {
        console.log("build tower mode deactivate");
        this._scene.removeEventListener(TouchEvent.TOUCH, this.onStageTouch);
        //TODO FIXME event listener stays
        this._scene.removeEventListeners(TouchEvent.TOUCH);
    }

    public get shadowTowerData(): ShadowTowerData {
        return this._shadowTowerData;
    }
}