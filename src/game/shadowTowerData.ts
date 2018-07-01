import TileData from "./tileData";
import { IAnimatable, IDestroyable, IGameView, IGameObj } from "./interfaces";
import PlayState from "./playState";
import ObjType from "./objType";
import BaseTowerData from "./baseTowerData";
import { Guid } from "guid-typescript";

export default class ShadowTowerData implements IGameObj {
	private _x: number = 0;
	private _y: number = 0;
	private _state: PlayState;
	private _buildingTowerData: BaseTowerData;
	private _isAbleToBuild: boolean;
	private _buildTile: TileData;
	private _uid: string;

	constructor(state: PlayState, towerFactory: Function) {
		this._state = state;
		this._buildingTowerData = towerFactory(this._state);
		this._uid = Guid.create().toString();
	}

	public getGuid() {
		return this._uid;
	}

	public getType(): ObjType {
		return ObjType.ShadowTower;
	}

	public get depth(): number {
		let tile: TileData = this._state.map.getTileByCoords(this.x, this.y);
		if (tile == null) {
			return null;
		}
		return tile.getDepth();
	}

	public destroy(): void {
		this._state = null;
	}

	public advanceTime(time: number): void {

	}

	public get x(): number {
		return this._x;
	}

	public set x(value: number) {
		this._x = value;
	}

	public get y(): number {
		return this._y;
	}

	public set y(value: number) {
		this._y = value;
	}

	public get buildingTowerData(): BaseTowerData {
		return this._buildingTowerData;
	}

	public findNearestLocation(x: number, y: number): void {
		this._buildTile = this._state.map.getTileByCoords(x, y);
		if (this._buildTile != null && this._state.towerManager.isAbleToBuildTower(this._buildTile)) {
			this.x = this._buildTile.cx;
			this.y = this._buildTile.cy;
			this._isAbleToBuild = this._state.towerManager.isAbleToBuildTower(this._buildTile);
		}
		else {
			this.x = x;
			this.y = y;
		}
	}

	public get isAbleToBuild(): boolean {
		return this._isAbleToBuild;
	}

	public get buildTile(): TileData {
		return this._buildTile;
	}
}