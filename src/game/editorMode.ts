import Starling from "starling/core/Starling";
import Button from "starling/display/Button";
import Image from "starling/display/Image";
import Sprite from "starling/display/Sprite";
import DisplayObject from "starling/display/DisplayObject";
import TouchEvent from "starling/events/TouchEvent";
import TouchPhase from "starling/events/TouchPhase";
import TextField from "starling/text/TextField";
import Align from "starling/utils/Align";
import Texture from "starling/textures/Texture";
import Touch from "starling/events/Touch";

import MapData from "./mapData";
import BaseMode from "./baseMode";
import TileData from "./tileData";
import Config from "./config";
import Console from "./console";
import KPoint from "./KPoint";
import Pools from "./pools";
import IsoTransform from "./isoTransform";
import { IAnimatable, IDestroyable, IGameView, IGameObj } from "./interfaces";
import PlayState from "./playState";
import App from "./app";


export default class EditorMode extends BaseMode {
	private _scene: Sprite;
	private _state: PlayState;
	private _currentPoint: KPoint;

	constructor() {
		super();
	}

	public onStageTouch(evt: TouchEvent): void {
		let touch: Touch = evt.getTouch(this._scene);
		if (touch) {
			switch (touch.phase) {
				case TouchPhase.BEGAN:
					break;

				case TouchPhase.ENDED:
					// if (this._currentPoint == null)
					// 	return;

					console.log("touch ended");
                    const loc = touch.getLocation(this._scene);
                    this._currentPoint = new KPoint(loc.x, loc.y);

					let isoCoords: KPoint = IsoTransform.toP(this._currentPoint);

					let tile: TileData =
						this._state.map.getTileByCoords(isoCoords.x, isoCoords.y);
                    //console.log(`iso ${tile.toString()}`);
					Pools.point.object = isoCoords;
					if (tile != null) {
						this._state.map.switchTile(tile);
					}
					break;

				case TouchPhase.MOVED:
					break;

				case TouchPhase.HOVER:
					// const point = touch.getLocation(this._scene);
					// this._currentPoint = new KPoint(point.x, point.y);

					break;
			}
		}
	}

	public activate(state: PlayState, data: Object = null): void {
		console.log("editor mode activate");
		this._state = state;
		this._scene = App.getScene();
		this._scene.addEventListener(TouchEvent.TOUCH, this.onStageTouch.bind(this));
	}

	public deactivate(): void {
        console.log("editor mode deactivate");
		this._scene.removeEventListener(TouchEvent.TOUCH, this.onStageTouch);
	}
}