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
import Quad from "starling/display/Quad";

export default class TowerStatView extends Sprite {
    private _state: PlayState;
    private _damage: TextField;


    constructor() {
        super();

        let footing: Quad = new Quad(Config.GameWidth, 50, 0xd3d3d3);
        footing.alpha = .3;
        footing.x = 0;
        footing.y = 0;
        this.addChild(footing);

        const format = new TextFormat();
        format.size = 15;
        format.color = 0x000000;
        const damageLabel = new TextField(Config.GameWidth - 50, 50, "", format);
        damageLabel.touchable = false;
        damageLabel.x = 50;
        this.addChild(damageLabel);
        this._damage = damageLabel;

        this.visible = false;
    }

    public init(state: PlayState): void {
        this._state = state;
        this._state.towerManager.onTowerUpgradeRequest.add(this.towerUpgradeRequest.bind(this));
    }


    towerUpgradeRequest(towerData: BaseTowerData) {
        this.visible = true;

        this._damage.text = "tower damage: " + towerData.effect.getValue();
    }
}