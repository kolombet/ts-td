import BaseTowerData from "./baseTowerData";
import { PlayState } from "./playState";
import BulletEffects from "./bulletEffects";
import Config from "./config";
import {TowerType} from "./towerFacotry";

export default class BasementTower extends BaseTowerData {
    constructor(state: PlayState) {
        super(state, BulletEffects.nodamage);
        this._towerType = TowerType.BASEMENT;
        this._radius = 0;
        this._shootSpeed = 999999999;
        this._price = 0;
    }

}