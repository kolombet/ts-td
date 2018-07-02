import Image from "starling/display/Image";
import Sprite from "starling/display/Sprite";
import TextField from "starling/text/TextField";
import App from "./app";
import TextFormat from "starling/text/TextFormat";
import Align from "starling/utils/Align";
import TouchEvent from "starling/events/TouchEvent";
import TouchPhase from "starling/events/TouchPhase";
import {IDestroyable} from "./interfaces";
import {PlayState} from "./playState";
import KButton from "./kbutton";
import BaseMode from "./baseMode";
import EditorMode from "./editorMode";
import NormalMode from "./normalMode";
import Util from "./util";
import {TowerFactory} from "./towerFacotry";
import Touch from "starling/events/Touch";
import Starling from "starling/core/Starling";
import Config from "./config";

export default class MainUI extends Sprite {
    bottomLeftBar: Sprite;
    hp: TextField;
    money: TextField;
    state: PlayState;
    bottomRightButton: KButton;
    currentState: GameSpeedState;

    constructor() {
        super();
        this.currentState = GameSpeedState.Normal;

        this.bottomRightButton = new KButton();
        this.bottomRightButton.text = "x1";
        this.addChild(this.bottomRightButton);
        this.bottomRightButton.x = window.innerWidth - this.bottomRightButton.width;
        this.bottomRightButton.y = window.innerHeight - this.bottomRightButton.height;
        this.bottomRightButton.addEventListener(TouchEvent.TOUCH, this.onTouch.bind(this));

        this.bottomLeftBar = new Sprite();
        this.addChild(this.bottomLeftBar);

        const bar = new Image(App.resources.assets.getTexture("bottomLeftBar"));
        this.bottomLeftBar.addChild(bar);

        this.bottomLeftBar.y = window.innerHeight - this.bottomLeftBar.height;
        this.bottomLeftBar.x = 0;

        this.hp = this.getText();
        this.money = this.getText();
        this.bottomLeftBar.addChild(this.hp);
        this.bottomLeftBar.addChild(this.money);


        this.money.x = 57;
        this.money.y = 10;

        this.hp.x = 132;
        this.hp.y = 10;
    }

    public nextState(gameSpeedState: GameSpeedState) {
        if (gameSpeedState == GameSpeedState.Paused)
            return GameSpeedState.Normal;
        if (gameSpeedState == GameSpeedState.Normal)
            return GameSpeedState.Fast;
        if (gameSpeedState == GameSpeedState.Fast)
            return GameSpeedState.SuperFast;
        if (gameSpeedState == GameSpeedState.SuperFast)
            return GameSpeedState.Paused;

        return GameSpeedState.Normal;
    }

    public getSpeedByState(gameSpeedState:GameSpeedState) {
        if (gameSpeedState == GameSpeedState.Paused)
            return 0;
        if (gameSpeedState == GameSpeedState.Normal)
            return 1;
        if (gameSpeedState == GameSpeedState.Fast)
            return 4;
        if (gameSpeedState == GameSpeedState.SuperFast)
            return 10;

        return 1;
    }

    public onTouch(evt: TouchEvent): void {

        let touch = evt.getTouch(this);
        if (touch == null)
            return;
        if (touch.phase == TouchPhase.ENDED) {
            if (evt.target == this.bottomRightButton) {
                this.currentState = this.nextState(this.currentState);
                const speed = this.getSpeedByState(this.currentState);
                Starling.current.juggler.timeScale = speed;
                this.bottomRightButton.text = "x" + speed;
            }
        }
        console.log("onTouch");
    }

    private getText() {
        const format = new TextFormat();
        format.size = 13;
        format.color = 0xFFFFFF;
        format.horizontalAlign = Align.LEFT;
        format.verticalAlign = Align.TOP;
        const textField = new TextField(50, 20, "0", format);
        textField.touchable = false;
        // textField.border = true;
        return textField;
    }

    public init(state: PlayState) {
        this.hp.text = state.lives.toString();
        this.money.text = state.money.toString();
        state.onMoneyChanged.add(this.onMoneyChanged.bind(this));
        state.onLivesChanged.add(this.onLivesChanged.bind(this));
    }

    private onLivesChanged(value: number): void {
        this.hp.text = value.toString();
    }

    private onMoneyChanged(value: number): void {
        this.money.text = value.toString();
    }

}

enum GameSpeedState {
    Paused,
    Normal,
    Fast,
    SuperFast
}