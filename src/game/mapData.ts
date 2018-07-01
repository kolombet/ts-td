import Starling from "starling/core/Starling";
import Button from "starling/display/Button";
import Image from "starling/display/Image";
import Sprite from "starling/display/Sprite";
import TouchEvent from "starling/events/TouchEvent";
import TouchPhase from "starling/events/TouchPhase";
import TextField from "starling/text/TextField";
import Align from "starling/utils/Align";

import PlayState from "./playState";
import TileData from "./tileData";
import Config from "./config";
import Signal from "./Signal";
import {IDestroyable, ISaveLoadable, IPassModel} from "./interfaces";
import Console from "./console";
import TileType from "./tileType";
import Save from "./save";
import PassModel from "./passModel";
import BaseTowerData from "./baseTowerData";
import BasementTower from "./basementTower";

class MapDataSave {
    size: number;
    data: any;
    base: any;
    spawnPoints: any;
}


export default class MapData implements ISaveLoadable, IDestroyable {
    private _state: PlayState;
    private _backgroundURL: string;
    private _size: number;
    private _data: TileData[][];
    private _base: TileData;
    private _path: TileData[];
    private _onMapDataChanged: Signal = new Signal();

    /**
     * @param size размер карты
     */
    constructor(state: PlayState) {
        this._state = state;
        this.backgroundURL = Config.BACKGROUND_RES + this._state.levelID + Config.RES_FORMAT;
        //console.log("map url: " + this.backgroundURL);
    }

    public findAllBasements():BaseTowerData[] {
        const basements: BaseTowerData[] = [];
        const mapData = this._data;
        for (let x: number = 0; x < mapData.length; x++) {
            let column: TileData[] = mapData[x];
            for (let y: number = 0; y < column.length; y++) {
                let tile = column[y];
                if (tile.tileType == TileType.BUILDSITE) {
                    let tile1 = mapData[x+1][y];
                    let tile2 = mapData[x][y+1];
                    let tile3 = mapData[x+1][y+1];
                    const site:TileData[] = [
                        tile,
                        tile1,
                        tile2,
                        tile3
                    ];
                    const basement = new BasementTower(this._state);
                    basement.targetTiles = site;
                    basements.push(basement);
                }
            }
        }
        return basements;
    }

    public getTileByCoords(x: number, y: number): TileData {
        let xTile: number = Math.floor(x / Config.TILE_SIZE);
        let yTile: number = Math.floor(y / Config.TILE_SIZE);
        let tile: TileData;
        if (xTile >= 0 && xTile < this._data.length) {
            let column: TileData[] = this._data[xTile];
            if (yTile >= 0 && yTile < column.length) {
                tile = column[yTile];
            }
        }
        return tile;
    }

    public switchTile(tile: TileData): void {
        if (tile == null) {
            return;
        }
        tile.tileType = TileType.getNext(tile.tileType);
        this._onMapDataChanged.dispatch();
    }

    public save(): Object {
        let obj: MapDataSave = new MapDataSave();
        obj.size = this._size;
        obj.data = Save.save2dTileData(this._data);
        // obj.base = this._base.save();
        // obj.spawnPoints = Save.saveVectTileData(this._spawnPoints);
        return obj;
    }

    public load(data: Object): void {
        let typedData = data as MapDataSave;
        this._size = typedData.size;
        this._data = Save.load2dTileData(this._state, typedData.data);

        this._base = this._data[11][7];

        // this._base = new TileData(this._state);
        // this._base.load(typedData.base);
        // this._spawnPoints = Save.loadVectTileData(this._state, typedData.spawnPoints);
    }

    public calculateRoads(passModel: IPassModel): void {
        this._path = passModel.getPath(null, null);
    }

    /**
     * Private
     */
    private generateDummyData(size: number): any[] {
        let tileGridData: TileData[][] = [];
        for (let x: number = 0; x < size; x++) {
            let column: TileData[] = [];
            for (let y: number = 0; y < size; y++) {
                column[y] = TileData.create(this._state, x, y);
            }
            tileGridData[x] = column;
        }
        return tileGridData;
    }

    private drawZone(zoneType:number, sx: number, sy: number, sizeX: number, sizeY: number): void {
        for (let x: number = sx; x < sx + sizeX; x++) {
            for (let y: number = sy; y < sy + sizeY; y++) {
                this._data[x][y].tileType = zoneType;
            }
        }
    }

    private roadCheck(): void {
        for (let x: number = 0; x < this._data.length; x++) {
            let column: TileData[] = this._data[x];
            for (let y: number = 0; y < column.length; y++) {
                if (column[y].tileType == TileType.BUILDSITE) {
                    let isNearRoad: boolean = this.checkIsNearRoad(column[y]);
                    if (isNearRoad) {
                        column[y].tileType = TileType.BUILDING;
                    }
                }
            }
        }
    }

    private checkIsNearRoad(targetTile: TileData): boolean {
        let checks: any[] = [
            this.checkIsRoad(targetTile.gridX + 1, targetTile.gridY - 1),
            this.checkIsRoad(targetTile.gridX + 1, targetTile.gridY),
            this.checkIsRoad(targetTile.gridX + 1, targetTile.gridY + 1),
            this.checkIsRoad(targetTile.gridX, targetTile.gridY + 1),
            this.checkIsRoad(targetTile.gridX - 1, targetTile.gridY + 1),
            this.checkIsRoad(targetTile.gridX - 1, targetTile.gridY),
            this.checkIsRoad(targetTile.gridX - 1, targetTile.gridY - 1),
            this.checkIsRoad(targetTile.gridX, targetTile.gridY - 1)
        ];
        for (let i: number = 0; i < checks.length; i++) {
            if (checks[i] == true) {
                return true;
            }
        }
        return false;
    }

    private checkIsRoad(tileX: number, tileY: number): boolean {
        if (tileX < 0 || tileY < 0 || tileX >= this._size || tileY >= this._size)
            return false;
        return this.data[tileX][tileY].tileType == TileType.FREE;
    }

    public get backgroundURL(): string {
        return this._backgroundURL;
    }

    public set backgroundURL(value: string) {
        this._backgroundURL = value;
    }

    public get size(): number {
        return this._size;
    }

    public get data(): any[] {
        return this._data;
    }

    public get base(): TileData {
        return this._base;
    }

    public get onMapDataChanged(): Signal {
        return this._onMapDataChanged;
    }

    /**
     * DEV
     */
    public initDummy(): void {
        this._size = 21;
        this._data = this.generateDummyData(this._size);
        console.log("data generated");
        this.drawZone(TileType.BLOCKED, 0, 0, this._size, this._size);

        this._base = this._data[13][3];
        this._base.tileType = TileType.BLOCKED;
    }

    public get path(): TileData[] {
        return this._path;
    }

    public destroy(): void {
        this._state = null;
        for (let x: number = 0; x < this._data.length; x++) {
            let column: TileData[] = this.data[x];
            for (let y: number = 0; y < column.length; y++) {
                column[y].destroy();
            }
        }
        this._data = null;
        this._base.destroy();
        this._base = null;
        this._path = null;
        this._onMapDataChanged.removeAll();
        this._onMapDataChanged = null
    }
}