import Sprite from "starling/display/Sprite";
import { IGameView, IGameObj } from "./interfaces";
import BaseCreepData from "./baseCreepData";
import Quad from "starling/display/Quad";
import Image from "starling/display/Image";
import KPoint from "./KPoint";
import IsoTransform from "./isoTransform";
import App from "./app";
import { Guid } from "guid-typescript";
import Config from "./config";
import Gauge from "./gauge";

export default class CreepView extends Sprite implements IGameView {
    private _creepData: BaseCreepData;

    private _hpBar:Sprite;
    private _hpBarGauge:Gauge;
    // private _animations: Object;//<MovieClip>
    // private _animationsList: MovieClip[];
    // private _playingAnimation: string;
    private _uid: string;

    constructor(data: BaseCreepData) {
        super();
        this._uid = Guid.create().toString();
        this._creepData = data;

        const img = new Image(App.resources.assets.getTexture("creep"));
        img.x = -img.width/2;
        img.y = -img.height/2;
        this.addChild(img);

        this._hpBar = new Sprite();
        this.addChild(this._hpBar);

        this._hpBar.addChild(new Image(App.resources.assets.getTexture("emptyHpBar")));
        this._hpBarGauge = new Gauge(App.resources.assets.getTexture("hpBar"));
        this._hpBarGauge.ratio = .5;
        this._hpBar.addChild(this._hpBarGauge);
        this._hpBar.scale = 0.5;
        this._hpBar.x = - this._hpBar.width/2;
        this._hpBar.y = -20;


        // this._animations = {};
        // this._animationsList = [];

        // let animations: any[] = Direction.getList();
        // for (let i: number = 0; i < animations.length; i++) {
        //     this.createAnimation(animations[i]);
        // }
        // this.playAnimation("TL");


        if (Config.DEBUG_CREEP_CENTER)
            this.drawFooting();
    }

    getGuid() {
        return this._uid;
    }

    // private playAnimation(type: string): void {
    //     if (this._playingAnimation) {
    //         let prevAnim: MovieClip = this._animations[this._playingAnimation];
    //         prevAnim.stop();
    //         prevAnim.visible = false;
    //         Starling.current.juggler.remove(prevAnim);
    //     }
    //
    //     let anim: MovieClip = this._animations[type];
    //     anim.visible = true;
    //     anim.play();
    //     Starling.current.juggler.add(anim);
    //     this._playingAnimation = type;
    // }

    private hideAll(): void {
        // this._animationsList.forEach((animation: MovieClip) => {
        //     animation.stop();
        //     animation.visible = false;
        //     Starling.current.juggler.remove(animation);
        // });
    }

    // public createAnimation(type: string): void {
    //     let animation: MovieClip = App.resources.getMonsterAnimation(this._mName, type);
    //     animation.visible = false;
    //     this.addChild(animation);
    //     this._animations[type] = animation;
    // }

    public drawFooting(): void {
        let footing: Quad = new Quad(4, 4, 0x00ff00);
        footing.x = -2;
        footing.y = -2;
        this.addChild(footing);
    }

    public destroy(): void {
        this._creepData = null;

        // this._animationsList.forEach((animation: MovieClip) => {
        //     this.removeChild(animation);
        //     animation.dispose();
        // });
        super.dispose();
    }

    public advanceTime(time: number): void {
        if (this._creepData == null) {
            return;
            //console.log("creep data null");
        }


        this._hpBarGauge.ratio = this._creepData.getHealthRatio();

        // if (this._creepData.rotationName && this._playingAnimation != this._creepData.rotationName) {
        //     this.playAnimation(this._creepData.rotationName);
        // }
        let creepPoint = new KPoint(this._creepData.x, this._creepData.y);
        let p: KPoint = IsoTransform.fromP(creepPoint);
        this.x = Math.round(p.x);
        this.y = Math.round(p.y);

    }

    public getData(): IGameObj {
        return this._creepData;
    }
}
