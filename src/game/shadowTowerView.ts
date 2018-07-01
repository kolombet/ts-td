import Image from "starling/display/Image";
import Sprite from "starling/display/Sprite";
import KPoint from "./KPoint";
import Pools from "./pools";
import IsoTransform from "./isoTransform";
import { IAnimatable, IDestroyable, IGameView, IGameObj } from "./interfaces";
import App from "./app";
import ShadowTowerData from "./shadowTowerData";
import { Guid } from "guid-typescript";

export default class ShadowTowerView extends Sprite implements IGameView {
	private _data: ShadowTowerData;
	private _uid: string;

	constructor(shadowTowerData: ShadowTowerData) {
		super();
		this._uid = Guid.create().toString();
		let img: Image = App.resources.getTowerByData(shadowTowerData.buildingTowerData);
		this.touchable = false;
		img.touchable = false;
		this.addChild(img);

		this._data = shadowTowerData;
	}

	public getGuid() {
		return this._uid;
	}

	public getData(): IGameObj {
		return this._data;
	}

	public advanceTime(time: number): void {
		// //console.log("tower position " + this._data.x)
		if (this._data == null || this._data.x == null)
			return;
		let p: KPoint = IsoTransform.fromP(new KPoint(this._data.x, this._data.y));
		this.x = p.x;
		this.y = p.y;
		Pools.point.object = p;
		this.alpha = (this._data.isAbleToBuild) ? .6 : .2;
	}

	public destroy(): void {
		this._data = null;
	}
}