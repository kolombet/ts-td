import Starling from "starling/core/Starling";
import Sprite from "starling/display/Sprite";
import { IGameView, IGameObj } from "./interfaces";
import BaseCreepData from "./baseCreepData";
import Direction from "./direction";
import MovieClip from "starling/display/MovieClip";
import Quad from "starling-framework/lib/starling/display/Quad";
import KPoint from "./KPoint";
import IsoTransform from "./isoTransform";
import Pools from "./pools";
import App from "./app";
import { Guid } from "guid-typescript";
import Config from "./config";

export default class CreepView extends Sprite implements IGameView {
    private static GNOME: string = "gnome";
    private static ORK: string = "ork";
    private _creepData: BaseCreepData;
    private _animations: Object;//<MovieClip>
    private _animationsList: MovieClip[];
    private _playingAnimation: string;
    private _mName: string;
    private _uid: string;

    constructor(data: BaseCreepData) {
        super();
        this._uid = Guid.create().toString();
        this._mName = (Math.random() > .5) ? CreepView.GNOME : CreepView.ORK;
        this._creepData = data;
        this._animations = {};
        this._animationsList = [];

        let animations: any[] = Direction.getList();
        for (let i: number = 0; i < animations.length; i++) {
            this.createAnimation(animations[i]);
        }
        this.playAnimation("TL");
        if (Config.DEBUG_CREEP_CENTER)
            this.drawFooting();
    }

    getGuid() {
        return this._uid;
    }

    private playAnimation(type: string): void {
        if (this._playingAnimation) {
            let prevAnim: MovieClip = this._animations[this._playingAnimation];
            prevAnim.stop();
            prevAnim.visible = false;
            Starling.current.juggler.remove(prevAnim);
        }

        let anim: MovieClip = this._animations[type];
        anim.visible = true;
        anim.play();
        Starling.current.juggler.add(anim);
        this._playingAnimation = type;
    }

    private hideAll(): void {
        this._animationsList.forEach((animation: MovieClip) => {
            animation.stop();
            animation.visible = false;
            Starling.current.juggler.remove(animation);
        });
    }

    public createAnimation(type: string): void {
        let animation: MovieClip = App.resources.getMonsterAnimation(this._mName, type);
        animation.visible = false;
        this.addChild(animation);
        this._animations[type] = animation;
        //console.log("create animation")
    }

    public drawFooting(): void {
        let footing: Quad = new Quad(4, 4, 0x00ff00);
        footing.x = -2;
        footing.y = -2;
        this.addChild(footing);
    }

    public destroy(): void {
        this._creepData = null;

        this._animationsList.forEach((animation: MovieClip) => {
            this.removeChild(animation);
            animation.dispose();
        });
        super.dispose();
    }

    public advanceTime(time: number): void {
        if (this._creepData == null) {
            return;
            //console.log("creep data null");
        }

        if (this._creepData.rotationName && this._playingAnimation != this._creepData.rotationName) {
            this.playAnimation(this._creepData.rotationName);
        }
        let creepPoint = new KPoint(this._creepData.x, this._creepData.y);
        let p: KPoint = IsoTransform.fromP(creepPoint);
        this.x = p.x;
        this.y = p.y;

        Pools.point.object = p;
    }

    public getData(): IGameObj {
        return this._creepData;
    }
}
