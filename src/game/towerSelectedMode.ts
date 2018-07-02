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

export default class TowerSelectedMode extends BaseMode {
    private _scene: Sprite;
    private _state: PlayState;
    private _towerData:  BaseTowerData;

    /*override*/
    public activate(state: PlayState, data: Object = null): void {
        this._towerData = data as BaseTowerData;
        console.log("tower selected mode activate");
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
                    this._state.activateNormal();
                    if (tile != null) {
                        console.log("try to touch " + tile.gridX + " " + tile.gridY);

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
}