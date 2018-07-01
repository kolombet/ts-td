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
import BaseTowerData from "./baseTowerData";
import { IGameView, IGameObj } from "./interfaces";
import App from "./app";
import IsoTransform from "./isoTransform";
import KPoint from "./KPoint";
import Pools from "./pools";
import { Guid } from "guid-typescript";

export default class TowerView extends Sprite implements IGameView
{
    private _towerData:BaseTowerData;
    private _uid;

    constructor(towerData:BaseTowerData)
    {
        super();
        this._uid = Guid.create().toString();
        this._towerData = towerData;
        let img:Image = App.resources.getTowerByData(this._towerData);
        this.addChild(img);

    }

    getGuid() {
        return this._uid;
    }
    
    public advanceTime(time:number):void
    {
        let p:KPoint = IsoTransform.fromP(this._towerData.coords);
        this.x = p.x;
        this.y = p.y;
    }
    
    public getData():IGameObj
    {
        return this._towerData;
    }
    
    public destroy():void
    {
        this._towerData = null;
        this.removeChildren();
    }
}