import Starling from "starling/core/Starling";
import Button from "starling/display/Button";
import Image from "starling/display/Image";
import Texture from "starling/textures/Texture";
import TextureAtlas from "starling/textures/TextureAtlas";
import AssetManager from "starling/utils/AssetManager";
import Config from "./config";
import Event from "starling-framework/lib/starling/events/Event";
import MovieClip from "starling-framework/lib/starling/display/MovieClip";
import BaseTowerData from "./baseTowerData";
import BasicTower from "./basicTower";
import App from "./app";
import AOETower from "./AOETower";
import FrostTower from "./frostTower";
import BasementTower from "./basementTower";
import CellGraphics from "./cellGraphics";

export default class Resources {
    private static JSON: string = ".json";
    private static COMPLETED: number = 1;

    /*[Embed(source="../../atlas/creeps.xml", mimeType="application/octet-stream")]*/
    // private static AtlasXml: Class;
    /*[Embed(source="../../atlas/creeps.png")]*/
    // private static AtlasTexture: Class;

    private static _instance: Resources;

    private _atlas: TextureAtlas;
    private _assets: AssetManager;

    // private _onLoadHandler: Function;

    constructor(assets: AssetManager) {
        this._assets = assets;
        if (Resources._instance) {
            throw new Error("Singleton error");
        }
        Resources._instance = this;
    }

    public init(): void {
        this.createAtlas();
    }

    public loadLevel(levelID: number, onLoad: Function): void {
        onLoad();
        // this._onLoadHandler = onLoad;
        // this._assets = new AssetManager();
        // let levelsRes = Config.BASE_URL + Config.LEVEL_RES + levelID + Resources.JSON;
        // this._assets.enqueue([Constants.LevelRes]);
        // let waveRes = Config.BASE_URL + Config.WAVE_RES + levelID + Resources.JSON;
        // this._assets.enqueue([Constants.WaveRes]);
        // this._assets.loadQueue(this.onProgress);
        // this._assets.addEventListener(Event.IO_ERROR, this.onError);
        // this._assets.addEventListener(Event.PARSE_ERROR, this.onError);

        // let manifest = new AssetManifest();
        // AssetLibrary
        //     .loadFromManifest(manifest)
        //     .onComplete((library) => {
        //         onLoad();
        //     }).onProgress((bytesLoaded, bytesTotal) => {

        //     }).onError((e) => {
        //         console.error(e);
        //     });
    }

    private onError(event: Event): void {
        throw new Error("Level resource not found: " + event.data.toString());
    }

    public getMonsterAnimation(mname: string, type: string): MovieClip {
        let isRotated: boolean = false;

        if (type.charAt(type.length - 1) == "R") {
            isRotated = true;
            type = type.replace("R", "L");
        }
        let textures = this._atlas.getTextures("creeps/" + mname + "/" + type + "/");
        // //console.log("len:"+textures.length)
        // textures = textures.splice(0, textures.length-5);
        // //console.log(textures.length);
        let movie: MovieClip = new MovieClip(textures, 10);
        movie.pivotX = movie.width / 2;
        movie.pivotY = movie.height / 2;
        if (isRotated) {
            movie.scaleX = -1;
        }
        movie.loop = true;
        return movie;
    }

    public getTower1(): Image {

        return this.getCenterImage(Config.TowerRes, true);
        // return this.getCenterImage("towers/tower1");
    }

    public getTower2(): Image {
        return this.getCenterImage(Config.TowerRes, true);
        // return this.getCenterImage("towers/tower2");
    }

    public getTower3(): Image {
        // return this.getCenterImage(Constants.TowerRes, true);
        let tower = this.getCenterImage("towers/tower3");
        tower.scale = 0.2;
        return tower;
    }

    public getTowerByData(towerData: BaseTowerData): Image {
        //console.log("get tower by data");
        let img: Image;
        if (towerData instanceof BasicTower) {

            img = new Image(App.resources.assets.getTexture("tower"));
            img.pivotX = img.width / 2;
            img.pivotY = img.height;
            img.y = Config.TILE_SIZE;

            img.scale = 1;
        }
        else if (towerData instanceof AOETower) {
            img = App.resources.getTower2();
            img.pivotY += img.height / 3;
            img.scale = 1;
        }
        else if (towerData instanceof FrostTower) {
            img = App.resources.getTower3();
            img.scale = .2;
        }
        else if (towerData instanceof BasementTower) {

            const tex = App.resources.assets.getTexture("basement");
            // const tex = App.resources.assets.getTexture(Config.TestTile);
            img = new Image(tex);
            img.pivotX = tex.width / 2;
            img.pivotY = tex.height;
            img.y = Config.TILE_SIZE;
            // img.pivotX = 33;
            // img.pivotY = 17;
        }

        return img;
    }

    public getTileTexture(color: string, isEmpty: boolean): Texture {
        let path: string = "tiles/";
        let emptyName: string = "Empty";
        path = path + color + (isEmpty ? emptyName : "");
        return this._atlas.getTexture(path);
    }

    public getBulletFire(): Image {
        let image: Image = this.getCenterImage("bullets/shot3");
        image.scale = .2;
        return image;
    }

    public getBulletAoeFire(): Image {
        let image: Image = this.getCenterImage("bullets/shot3");
        return image;
    }

    public getBulletFrost(): Image {
        let image: Image = this.getCenterImage("bullets/shot4");
        image.scale = .2;
        return image;
    }

    /***********
     * Private
     ***********/
    private createAtlas(): void {
        //TODO load atlas and xml
        // let texture: Texture = Texture.fromEmbeddedAsset(Resources.AtlasTexture);
        // let altasXML = new Resources.AtlasXml
        // let xml: XML = XML(new Resources.AtlasXml());
        // this._atlas = new TextureAtlas(texture, xml);
        // new TextureAtlas()
        let atlasTexture = this._assets.getTexture(Config.Creeps);
        let atlasData = this._assets.getObject(Config.CreepsXML);
        this._atlas = new TextureAtlas(atlasTexture, atlasData);
    }

    // private onProgress(value: number): void {
    //     if (value == Resources.COMPLETED) {
    //         this._onLoadHandler();
    //     }
    // }

    private getCenterImage(path: string, isFromAssetManager: boolean = false): Image {
        let texture: Texture;
        if (isFromAssetManager) {
            texture = this.assets.getTexture(path);
        } else {
            texture = this._atlas.getTexture(path);
        }

        if (texture == null) {
            //console.log("texture null error");
        } else {
            //console.log("texture not null");
        }

        let image: Image = new Image(texture);
        image.pivotX = image.width / 2;
        image.pivotY = image.height / 2;
        return image;
    }

    private getBottomCenterImage(path: string): Image {
        let image: Image = new Image(this._atlas.getTexture(path));
        image.pivotX = image.width / 2;
        image.pivotY = image.height;
        return image;
    }

    public get assets(): AssetManager {
        return this._assets;
    }


}

