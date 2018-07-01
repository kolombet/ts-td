import Image from "starling/display/Image";
import Sprite from "starling/display/Sprite";
import TextField from "starling/text/TextField";
import Align from "starling/utils/Align";
import Texture from "starling/textures/Texture";

import MapData from "./mapData";
import BaseMode from "./baseMode";
import TileData from "./tileData";
import Config from "./config";
import Console from "./console";
import KPoint from "./KPoint";
import IsoTransform from "./isoTransform";
import App from "./app";
import BitmapFont from "starling/text/BitmapFont";
import EditorMode from "./editorMode";
import BuildTowerMode from "./buildTowerMode";

class GridView extends Sprite {
    private _cells: TileView[][];
    private _mode: BaseMode;

    public setMode(mode: BaseMode): void {
        if (mode instanceof EditorMode) {
            this.setCoordinatesVisible(true);
        }
        if (mode instanceof BuildTowerMode) {
            this.setCoordinatesVisible(false);
        }
        this._mode = mode;
    }

    public setCoordinatesVisible(value:boolean) {
        for (let x: number = 0; x < this._cells.length; x++) {
            let yLenth = this._cells[x].length;
            for (let y: number = 0; y < yLenth; y++) {
                let tileView: TileView = this._cells[x][y];
                tileView.setTextVisible(value);
            }
        }
    }

    /**
     * Update images to match cell content
     */
    public updateGrid(map: MapData): void {
        if (this._cells == null) {
            this.init(map);
            return;
        }
        for (let x: number = 0; x < map.size; x++) {
            for (let y: number = 0; y < map.size; y++) {
                let tile: TileData = map.data[x][y];
                let tileView: TileView = this._cells[x][y];
                let texture: Texture = App.cells.getByTileType(tile.tileType, this._mode);
                tileView.visible = texture != null;
                if (texture != null) {
                    tileView.setTexture(texture);
                }
                this._cells[x][y] = tileView;
            }
        }
    }

    /**
     * Create images for all tiles.
     */
    private init(map: MapData): void {
        let columns: TileView[][] = [];
        for (let x: number = 0; x < map.size; x++) {
            let row: TileView[] = [];
            for (let y: number = 0; y < map.size; y++) {
                let tile: TileData = map.data[x][y];
                // let tileView: TileView;
                let texture: Texture = App.cells.getByTileType(tile.tileType, this._mode);
                let tileView = this.drawTile(tile, texture);
                row.push(tileView);
            }
            columns.push(row)
        }
        this._cells = columns;
    }

    private drawTile(tile: TileData, texture: Texture): TileView {
        let isVisible: boolean = true;
        if (texture == null) {
            isVisible = false;
            texture = App.cells.emptyCellTexture;
        }
        Console.info("draw tile " + tile.gridX + " x " + tile.gridY);
        let tileView: TileView = new TileView(texture);
        tileView.visible = isVisible;
        tileView.setText(`${tile.gridX},${tile.gridY}`);
        let p: KPoint = new KPoint(tile.cx, tile.cy);
        p = IsoTransform.fromP(p);
        tileView.x = p.x;
        tileView.y = p.y;

        this.addChild(tileView);
        return tileView;
    }

    public destroy(): void {
        this._mode = null;
        for (let i: number = 0; i < this._cells.length; i++) {
            for (let j: number = 0; j < this._cells[i].length; j++) {
                this._cells[i][j].dispose();
                this._cells[i][j] = null;
            }
        }
        this._cells = null;
    }
}

class TileView extends Sprite {
    private _tileView: Image;
    private _label: TextField;

    constructor(texture: Texture) {
        super();

        this.pivotX = Config.TILE_SIZE;
        this.pivotY = Config.TILE_SIZE_HALF;

        let tileView: Image = new Image(texture);
        // tileView.scale = 2;
        this._tileView = tileView;
        this.addChild(tileView);

        const fontName = BitmapFont.MINI;
        const fontSize = BitmapFont.NATIVE_SIZE;
        const fontColor = 0xffffff;
        const width = 90;
        const height = 27;

        this._label = new TextField(width, height, "");
        this._label.format.setTo(fontName, fontSize, fontColor, Align.LEFT);
        this._label.batchable = true;
        this._label.x = Config.TILE_SIZE_HALF;
        this.addChild(this._label);
    }

    public setTexture(texture: Texture) {
        this._tileView.texture = texture;
    }

    public setText(text: string) {
        // console.log("set text");
        this._label.text = text;
    }

    public setTextVisible(value: boolean) {
        this._label.visible = value;
    }
}

export default GridView;