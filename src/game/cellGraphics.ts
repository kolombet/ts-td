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
import GridCell from "./gridCell";
import Config from "./config";
import App from "./app";
import {IMode} from "./interfaces";
import EditorMode from "./editorMode";
import BuildTowerMode from "./buildTowerMode";
import TileType from "./tileType";

export default class CellGraphics {
    public emptyCellTexture: Texture; //Green empty
    public readyToBuildCellTexture: Texture; //Green filled
    public blockedCellTexture: Texture; //Red filled
    public noCellTexture: Texture; //Cell not active

    public static GREEN: string = "green";
    public static BLUE: string = "blue";
    public static GREY: string = "grey";
    public static RED: string = "red";
    public static EMPTY: string = "empty";

    constructor() {
        //drawTextures();
        this.getTexturesFromAtlas();
    }

    // private drawTextures():void
    // {
    // 	let emptyCell:GridCell = new GridCell();
    // 	emptyCell.drawEmptyTile();
    // 	this.emptyCellTexture = emptyCell.getTexture();
    //
    // 	let rtb:GridCell = new GridCell();
    // 	rtb.drawTile(0x00ff00, true, 0x00ff00);
    // 	this.readyToBuildCellTexture = rtb.getTexture();
    //
    // 	let blocked:GridCell = new GridCell();
    // 	blocked.drawTile(0xff0000, true, 0xff0000);
    // 	this.blockedCellTexture = blocked.getTexture();
    //
    // 	this.noCellTexture = Texture.empty(Config.ISO_TILE_WIDTH, Config.ISO_TILE_HEIGHT);
    // }

    private getTexturesFromAtlas(): void {
        this.emptyCellTexture = App.resources.getTileTexture(CellGraphics.GREEN, true);
        this.readyToBuildCellTexture = App.resources.getTileTexture(CellGraphics.GREEN, false);
        this.blockedCellTexture = App.resources.getTileTexture(CellGraphics.RED, false);
        this.noCellTexture = App.resources.getTileTexture(CellGraphics.EMPTY, false);
    }

    public getByTileType(type: number, mode: IMode): Texture {
        if (mode instanceof EditorMode) {
            return this.tileByTypeEditor(type)
        }
        else if (mode instanceof BuildTowerMode) {
            return this.tileByTypeBuild(type);
        }
        //else if (mode is NormalMode)
        //{
        //	return noCellTexture;
        //}
        return null;
    }

    private tileByTypeEditor(type: number): Texture {
        if (type == TileType.FREE) {
            return this.emptyCellTexture;
        }
        else if (type == TileType.BUILDSITE || type == TileType.BUILDING) {
            return this.readyToBuildCellTexture;
        }
        else if (type == TileType.BLOCKED) {
            return this.blockedCellTexture;
        }
        else {
            throw new Error("wrong tile type");
        }
    }

    private tileByTypeBuild(type: number): Texture {
        if (type == TileType.FREE) {
            return this.noCellTexture;
        }
        else if (type == TileType.BUILDSITE) {
            return this.readyToBuildCellTexture;
        }
        else if (type == TileType.BUILDING) {
            return this.blockedCellTexture;
        }
        else if (type == TileType.BLOCKED) {
            return this.noCellTexture;
        }
        else {
            throw new Error("wrong tile type");
        }
    }
}