import Sprite from "starling/display/Sprite";
import Image from "starling/display/Image";
import App from "./app";
import Config from "./config";
import TextField from "starling/text/TextField";
import TextFormat from "starling/text/TextFormat";
import Texture from "starling/textures/Texture";
import PlayState from "./playState";
import BaseTowerData from "./baseTowerData";
import IsoTransform from "./isoTransform";
import Touch from "starling/events/Touch";
import TouchPhase from "starling/events/TouchPhase";
import TouchEvent from "starling/events/TouchEvent";
import BaseMode from "./baseMode";
import TowerSelectedMode from "./towerSelectedMode";
import NormalMode from "./normalMode";

export default class UpgradeView extends Sprite {
    fireButton: ElementButtonView;
    waterButton: ElementButtonView;
    private _state: PlayState;

    constructor() {
        super();

        const fire = App.resources.assets.getTexture(Config.UpgradeButtonFire);
        const fireButton = new ElementButtonView(fire, 100);
        fireButton.scale = .5;
        fireButton.alignPivot("center", "center");
        fireButton.touchable = true;
        fireButton.touchTarget.addEventListener(TouchEvent.TOUCH, this.onTouch.bind(this));
        this.addChild(fireButton);
        this.fireButton = fireButton;

        const water = App.resources.assets.getTexture(Config.UpgradeButtonWater);
        const waterButton = new ElementButtonView(water, 200);
        waterButton.scale = .5;
        waterButton.alignPivot("center", "center");
        waterButton.touchable = true;
        waterButton.touchTarget.addEventListener(TouchEvent.TOUCH, this.onTouch.bind(this));
        this.addChild(waterButton);
        this.waterButton = waterButton;

        this.visible = false;
    }

    public onTouch(evt:TouchEvent): void {

        let touch = evt.getTouch(this);
        this.onFireButtonTouch(touch, evt);
        console.log("onTouch");
    }

    public onFireButtonTouch(touch: Touch, evt:TouchEvent): void {
        console.log("onFireButtonTouch");
        if (touch == null)
            return;
        if (touch.phase == TouchPhase.ENDED) {
            console.log("touch ended");
            if (evt.target == this.fireButton.touchTarget) {
                console.log("fire button upgraded");
                this.visible = false;
            }
            else if (evt.target == this.waterButton.touchTarget) {
                this.visible = false;
            }
            else {
                this.visible = false;
            }
        }
    }

    public init(state: PlayState) {
        this._state = state;
        this._state.towerManager.onTowerUpgradeRequest.add(this.towerUpgradeRequest.bind(this));
        this._state.modeActivated.add(this.towerDeselected.bind(this));
    }

    towerDeselected(mode:BaseMode) {
        if (mode instanceof TowerSelectedMode) {
            this.visible = true;
        }
        if (mode instanceof NormalMode) {
            this.visible = false;
        }
    }

    towerUpgradeRequest(towerData: BaseTowerData) {
        const point = IsoTransform.fromP(towerData.coords);
        this.fireButton.x = point.x - 50;
        this.fireButton.y = point.y;

        this.waterButton.x = point.x + 50;
        this.waterButton.y = point.y;
        console.log("test");
    }

    getUpgradeIcon() {

    }
}

class ElementButtonView extends Sprite {
    public touchTarget:Image;
    constructor(texture: Texture, price: number) {
        super();
        this.width = 100;
        this.height = 100;

        const fireIcon = new Image(texture);
        fireIcon.touchable = true;
        this.touchTarget = fireIcon;
        this.addChild(fireIcon);

        const format = new TextFormat();
        format.size = 20;
        format.color = 0xFFFFFF;
        const priceLabel = new TextField(100, 100, price.toString(), format);
        priceLabel.touchable = false;
        this.addChild(priceLabel);
    }
}