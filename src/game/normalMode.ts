import {PlayState} from "./playState";
import BaseMode from "./baseMode";
import App from "./app"
import Touch from "starling/events/Touch";
import TouchEvent from "starling/events/TouchEvent";
import TouchPhase from "starling/events/TouchPhase";
import Sprite from "starling/display/Sprite";
import KPoint from "./KPoint";
import IsoTransform from "./isoTransform";
import TileType from "./tileType";
import Console from "./console";
import TileData from "./tileData";
import BaseTowerData from "./baseTowerData";
import {TowerFactory} from "./towerFacotry";
import BasementTower from "./basementTower";

export default class NormalMode extends BaseMode {
    private _scene: Sprite;
    private _state: PlayState;

    /*override*/
    public activate(state: PlayState, data: Object = null): void {
        console.log("main mode activate");
        this._state = state;
        this._scene = App.getScene();
        this._scene.addEventListener(TouchEvent.TOUCH, this.onStageTouch.bind(this));
    }

    public onStageTouch(evt: TouchEvent): void {
        let touch: Touch = evt.getTouch(this._scene);
        // console.log("on stage touch");
        // App.instance.view.upgradeView.onFireButtonTouch(touch, evt);
        if (touch) {
            switch (touch.phase) {
                case TouchPhase.BEGAN:
                    const touchLocation = touch.getLocation(this._scene);
                    let p: KPoint = IsoTransform.toP(touchLocation);

                    let tile = this._state.map.getTileByCoords(p.x, p.y);
                    if (tile != null) {
                        const tower = this._state.towerManager.getTowerByCoordinates(tile);

                        console.log("try to touch " + tile.gridX + " " + tile.gridY);

                        if (tower != null) {
                            if (tower instanceof BasementTower) {
                                this._state.towerManager.upgradeTower(tower);
                            } else {
                                console.log("tower upgrade request");
                                this._state.towerManager.activateTowerUpgrade(tower);
                            }
                        } else {
                            this.tryToBuild(tile);
                        }
                    } else {
                        console.log('tile is null')
                    }
                    break;

                case TouchPhase.ENDED:

                    break;

                case TouchPhase.MOVED:
                    break;

                case TouchPhase.HOVER:
                    break;
            }
        }
    }

    /*override*/
    public deactivate(): void {
        console.log("main mode deactivate");
        this._scene.removeEventListener(TouchEvent.TOUCH, this.onStageTouch);
        //TODO FIXME event listener stays
        this._scene.removeEventListeners(TouchEvent.TOUCH);
    }

    private tryToBuild(tile: TileData): void {
        if (tile != null && tile.tileType == TileType.BUILDSITE) {
            const towerFactory = TowerFactory.createBasicTower;
            let tower: BaseTowerData = towerFactory(this._state);
            let res: boolean = this._state.towerManager.buildTowerByTile(tile, tower);
            if (res == true) {
                Console.debug("builded tower");
            }
            else {
                Console.debug("not builded");
            }
        }
    }
}