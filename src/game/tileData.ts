import PlayState from "./playState"
import TileType from "./tileType";
import Config from "./config";
import {ISaveLoadable, IDestroyable} from "./interfaces";

class TileDataSave {
    gridX:number;
    gridY:number;
    tileType:number;
}

class TileData implements ISaveLoadable, IDestroyable {
    private _state: PlayState;
    /**
     * look TileType
     */
    private _tileType: number;
    /**
     * Can creeps pass this tile
     */
    private _isOccupied: boolean;
    /**
     * X in tiles
     */
    public gridX: number;
    /**
     * Y in tiles
     */
    public gridY: number;
    /**
     * Center x
     */
    public cx: number;
    /**
     * Center y
     */
    public cy: number;

    constructor(state: PlayState) {
        this._state = state;
    }

    public static create(_state: PlayState, gridX: number, gridY: number): TileData {
        let tile: TileData = new TileData(_state);
        tile.init(gridX, gridY);
        return tile;
    }

    public init(gridX: number, gridY: number): TileData {
        this.gridX = gridX;
        this.gridY = gridY;
        this.calculate();
        this.tileType = TileType.FREE;
        return this;
    }

    public calculate(): void {
        this.gridX = this.gridX;
        this.gridY = this.gridY;
        this.cx = (this.gridX + .5) * Config.TILE_SIZE;
        this.cy = (this.gridY + .5) * Config.TILE_SIZE;
    }

    public get tileType(): number {
        return this._tileType;
    }

    public set tileType(value: number) {
        if (value == this._tileType)
            return;

        this._isOccupied = (value == TileType.BUILDSITE || value == TileType.BLOCKED);
        this._tileType = value;
        if (this._state.map) {
            this._state.map.onMapDataChanged.dispatch();
        }
    }

    public get isOccupied(): boolean {
        return this._isOccupied;
    }

    public save(): Object {
        let save: TileDataSave = new TileDataSave;
        save.gridX = this.gridX;
        save.gridY = this.gridY;
        save.tileType = this._tileType;
        return save;
    }

    public load(data: Object): void {
        let save: TileDataSave = data as TileDataSave;
        this.gridX = save.gridX;
        this.gridY = save.gridY;
        this.tileType = save.tileType;
        this.calculate();
    }

    public destroy(): void {
        this._state = null;
    }

    public getDepth(): number {
        return this.gridX + this.gridY;
    }

    public toString(): string {
        return this.gridX + ' ' + this.gridY;
    }
}

export default TileData;