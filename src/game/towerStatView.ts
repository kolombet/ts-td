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
import BaseMode from "./baseMode";
import TowerSelectedMode from "./towerSelectedMode";
import NormalMode from "./normalMode";

export default class TowerStatView extends Sprite {
    private _state: PlayState;
    private _damage: TextField;
    private _speed: TextField;
    private _range: TextField;
    private _height: number = 25;


    constructor() {
        super();



        this._damage = this.getLabel();
        this._range = this.getLabel();
        this._speed = this.getLabel();

        const stats = [this._damage, this._range, this._speed];

        let footing: Quad = new Quad(Config.GameWidth, this._height * stats.length, 0xd3d3d3);
        footing.alpha = .7;
        footing.x = 0;
        footing.y = 0;
        this.addChild(footing);

        for (let i = 0; i < stats.length; i++) {
            let stat = stats[i];
            stat.y = i * this._height;
            this.addChild(stat);
        }

        this.visible = false;
    }

    private getLabel(text:string = ""):TextField {
        const format = new TextFormat();
        format.size = 12;
        format.color = 0x000000;
        const damageLabel = new TextField(Config.GameWidth - 50, this._height, "", format);
        damageLabel.touchable = false;
        damageLabel.x = 50;
        damageLabel.text = text;
        damageLabel.border = true;
        return damageLabel;
    }

    public init(state: PlayState): void {
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
        this._damage.text = "Damage: " + towerData.effect.getValue();
        this._speed.text = "Speed: " + towerData.shootSpeed;
        this._range.text = "Range: " + towerData.radius;
    }
}