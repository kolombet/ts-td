import Bitmap from "openfl/display/Bitmap";
import Sprite from "openfl/display/Sprite";
import OpenFLStage from "openfl/display/Stage";
import Context3DRenderMode from "openfl/display3D/Context3DRenderMode";
import OpenFLEvent from "openfl/events/Event";
import Rectangle from "openfl/geom/Rectangle";
import Capabilities from "openfl/system/Capabilities";
import StageScaleMode from "openfl/display/StageScaleMode";
import AssetLibrary from "openfl/utils/AssetLibrary";
import AssetManifest from "openfl/utils/AssetManifest";
import Assets from "openfl/utils/Assets";
import ByteArray from "openfl/utils/ByteArray";
import Starling from "starling/core/Starling";
import Event from "starling/events/Event";
import BitmapFont from "starling/text/BitmapFont";
import TextField from "starling/text/TextField";
import Texture from "starling/textures/Texture";
import TextureAtlas from "starling/textures/TextureAtlas";
import AssetManager from "starling/utils/AssetManager";
import Max from "starling/utils/Max";
import RectangleUtil from "starling/utils/RectangleUtil";
import App from "./game/app";
import Config from "./game/config";
import Lib from "openfl/Lib";
import AtlasData from "./game/atlasData";

class Main extends Sprite {
    private _starling: Starling;
    private _background: Bitmap;
    private _openflElement:HTMLElement;
    private _openflCanvas:HTMLElement;
    // private _progressBar: ProgressBar;

    public constructor() {
        super();

        if (this.stage != null) this.start();
        else this.addEventListener(Event.ADDED_TO_STAGE, this.onAddedToStage.bind(this));
    }

    private onAddedToStage(event: OpenFLEvent): void {
        this.removeEventListener(Event.ADDED_TO_STAGE, this.onAddedToStage);

        this.stage.scaleMode = StageScaleMode.NO_SCALE;

        // this.stage.scaleMode = StageScaleMode.SHOW_ALL;
        // this.stage.scaleMode = StageScaleMode.EXACT_FIT;
        // this.stage.scaleMode = StageScaleMode.NO_BORDER;

        this.start();
    }

    private start(): void {
        // We develop the game in a *fixed* coordinate system of 320x480. The game might
        // then run on a device with a different resolution; for that case, we zoom the
        // viewPort to the optimal size for any display and load the optimal textures.

        this._openflElement = document.getElementById('openfl-content');

        Starling.multitouchEnabled = true; // for Multitouch Scene

        // this._starling = new Starling(Game, this.stage, null, null, Context3DRenderMode.AUTO, "auto");
        this._starling = new Starling(App, this.stage, null, null, Context3DRenderMode.AUTO, "auto");

        // let w = window.innerWidth;
        // let h = window.innerHeight;
        // this._starling.stage.stageWidth = Config.GameWidth;
        // this._starling.stage.stageHeight = Config.GameHeight;

        this._starling.enableErrorChecking = Capabilities.isDebugger;
        this._starling.skipUnchangedFrames = true;
        this._starling.supportBrowserZoom = true;
        this._starling.supportHighResolutions = true;
        this._starling.simulateMultitouch = true;
        this._starling.addEventListener(Event.ROOT_CREATED, () => {
            this.loadAssets(this.startGame.bind(this));
        });

        // this.stage.addEventListener(Event.RESIZE, this.onResize.bind(this), false, Max.INT_MAX_VALUE, true);
        window.addEventListener('resize', () => { this.onResize(); });

        this._starling.start();
        this.initElements();
    }

    private getTextureList():Array<string> {
        return [
            Config.Map,
            Config.Creeps,
            Config.TowerRes,
            Config.UpgradeButtonFire,
            Config.UpgradeButtonWater,
            Config.Basement,
            Config.TestTile
        ]
    }

    private loadAssets(oneComplete: (assets: AssetManager) => void): void {
        let assets: AssetManager = new AssetManager();

        assets.verbose = Capabilities.isDebugger;

        let manifest = new AssetManifest();
        let textures = this.getTextureList();
        for (let texture of textures) {
            manifest.addBitmapData(texture);
        }
        // manifest.addBitmapData(Config.Map);
        // manifest.addBitmapData(Config.Creeps);
        // manifest.addBitmapData(Config.TowerRes);

        manifest.addText(Config.CreepsXML);
        manifest.addText(Config.LevelRes);
        manifest.addText(Config.WaveRes);



        const atlasMap = AtlasData.getAtlasMap();
        manifest.addBitmapData(atlasMap.pngURL);
        manifest.addText(atlasMap.xmlURL);
        // manifest.addBitmapData("assets/textures/1x/atlas.png");
        // manifest.addText("assets/textures/1x/atlas.xml");
        // manifest.addBitmapData("assets/fonts/1x/desyrel.png");
        // manifest.addText("assets/fonts/1x/desyrel.fnt");
        // manifest.addBitmapData("assets/textures/1x/background.jpg");
        // manifest.addSound(["assets/audio/wing_flap.ogg", "assets/audio/wing_flap.mp3"]);
        // manifest.addBytes("assets/textures/1x/compressed_texture.atf");
        // manifest.addFont("DejaVu Sans");
        // manifest.addFont("Ubuntu");

        AssetLibrary.loadFromManifest(manifest).onComplete(function (library) {

            Assets.registerLibrary("default", library);

            // let mapTexture = Texture.fromBitmapData(Assets.getBitmapData(Config.Map), false);
            // let creepsTexture = Texture.fromBitmapData(Assets.getBitmapData(Config.Creeps), false);
            // let towerTexture = Texture.fromBitmapData(Assets.getBitmapData(Config.TowerRes), false);
            let creepsXML = Assets.getText(Config.CreepsXML);
            let levelRes = Assets.getText(Config.LevelRes);
            let waveRes = Assets.getText(Config.WaveRes);

            assets.addObject(Config.LevelRes, levelRes);
            assets.addObject(Config.WaveRes, waveRes);
            assets.addObject(Config.CreepsXML, creepsXML);

            // assets.addTexture(Config.Map, mapTexture);
            // assets.addTexture(Config.Creeps, creepsTexture);
            // assets.addTexture(Config.TowerRes, towerTexture);
            for (let texture of textures) {
                let bmd = Assets.getBitmapData(texture);
                let loaded = Texture.fromBitmapData(bmd);
                assets.addTexture(texture, loaded);
                manifest.addBitmapData(texture);
            }

            //console.log("loaded textures")
            // let desyrelTexture: Texture = Texture.fromBitmapData(Assets.getBitmapData("assets/fonts/1x/desyrel.png"), false);
            // let desyrelXml: String = Assets.getText("assets/fonts/1x/desyrel.fnt");
            // let bitmapFont = new BitmapFont(desyrelTexture, desyrelXml);
            // TextField.registerCompositor(bitmapFont, bitmapFont.name);

            // let atlasTexture: Texture = Texture.fromBitmapData(Assets.getBitmapData("assets/textures/1x/atlas.png"), false);
            // let atlasXml: String = Assets.getText("assets/textures/1x/atlas.xml");
            // assets.addTexture("atlas", atlasTexture);
            // assets.addTextureAtlas("atlas", new TextureAtlas(atlasTexture, atlasXml));

            let mapPng = Texture.fromBitmapData(Assets.getBitmapData(atlasMap.pngURL), false);
            let mapXML = Assets.getText(atlasMap.xmlURL);
            assets.addTextureAtlas(atlasMap.name, new TextureAtlas(mapPng, mapXML));


            // assets.addTexture("background", Texture.fromBitmapData(Assets.getBitmapData("assets/textures/1x/background.jpg"), false));
            // assets.addSound("wing_flap", Assets.getSound("assets/audio/wing_flap.ogg"));
            // let compressedTexture: ByteArray = Assets.getBytes("assets/textures/1x/compressed_texture.atf");
            // assets.addByteArray("compressed_texture", compressedTexture);
            oneComplete(assets);

        }).onProgress((bytesLoaded, bytesTotal) => {
            // if (this._progressBar != null && bytesTotal > 0) {
            //     this._progressBar.ratio = (bytesLoaded / bytesTotal);
            // }
        }).onError((e) => {
            console.error(e);
        });
    }

    private onResizeTest(){
        const NOMINAL_WIDTH = Config.GameWidth;
        const NOMINAL_HEIGHT = Config.GameHeight;
        let stageScaleX:number = this.stage.stageWidth / NOMINAL_WIDTH;
        let stageScaleY:number = this.stage.stageHeight / NOMINAL_HEIGHT;

        let stageScale:number = Math.min(stageScaleX, stageScaleY);

        Lib.current.x = 0;
        Lib.current.y = 0;
        Lib.current.scaleX = stageScale;
        Lib.current.scaleY = stageScale;
        console.log("scale");

        if(stageScaleX > stageScaleY) {
            Lib.current.x = (this.stage.stageWidth - NOMINAL_WIDTH * stageScale) / 2;
        } else {
            Lib.current.y = (this.stage.stageHeight - NOMINAL_HEIGHT * stageScale) / 2;
        }
        console.log("Lib.current.x" + Lib.current.x);
    }

    private startGame(assets: AssetManager): void {
        let game: App = this._starling.root as App;
        game.start(assets);
        this.onResize();
        setTimeout(this.removeElements.bind(this), 150); // delay to make 100% sure there's no flickering.
    }

    private initElements(): void {
        // this._progressBar = new ProgressBar(175, 20);
        // this._progressBar.x = Config.GameWidth / 2;
        // this._progressBar.y = Config.GameHeight / 2;
        // this.addChild(this._progressBar);

        // BitmapData.loadFromFile("assets/textures/1x/background.jpg").onComplete((bitmapData) => {
        // this._background = new Bitmap(bitmapData);
        // this._background.smoothing = true;
        // this.addChild(this._background);
        // });
    }

    private removeElements(): void {
        if (this._background != null) {
            this.removeChild(this._background);
            this._background = null;
        }

        // if (this._progressBar != null) {
        //     this.removeChild(this._progressBar);
        //     this._progressBar = null;
        // }
    }

    private onResize(e: OpenFLEvent = null): void {

        // this.onResizeTest();
        if (this._openflCanvas == null) {
            this._openflCanvas = document.getElementsByTagName('canvas')[0];
            console.log("got canvas ");
        }

        console.log("on resize");
        let w = window.innerWidth;
        let h = window.innerHeight;

        // Lib.current.scaleX = 1;
        // Lib.current.scaleY = 1;
        // Lib.current.width = w;
        // Lib.current.height = h;

        // this.stage.width = w;
        // this.stage.height = h;
        this._starling.stage.stageWidth = w;
        this._starling.stage.stageHeight = h;

        let viewPort = new Rectangle(0, 0, w, h);

        const wpx = w + "px";
        const hpx = h + "px";
        this._openflElement.style.width  = wpx;
        this._openflElement.style.height  = hpx;

        if (this._openflCanvas != null) {
            this._openflCanvas.style.width = wpx;
            this._openflCanvas.style.height = hpx;
            this._openflCanvas["width"] = w;
            this._openflCanvas["height"] = h;
        }

        App.instance.updateScale(w, h);


        // let viewPort: Rectangle = RectangleUtil.fit(
        //     new Rectangle(0, 0, Config.GameWidth, Config.GameHeight),
        //     new Rectangle(0, 0, this.stage.stageWidth, this.stage.stageHeight)
        // );
        try {
            this._starling.viewPort = viewPort;
        }
        catch (error) {
            console.error("viewport erro");
        }

    }
}


let content = document.getElementById("openfl-content");
// let w = content.clientWidth;
// let h = content.clientHeight;
// console.log('content ' + w + ' ' + h);
console.log("window devicepixelratio: " + window.devicePixelRatio);
let w = window.innerWidth;
let h = window.innerHeight;
let stage = new OpenFLStage(w, h, 0x000000, Main);
content.appendChild(stage.element);