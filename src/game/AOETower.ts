import { PlayState } from "./playState";
import Config from "./config";
import BaseTowerData from "./baseTowerData";
import BulletEffects from "./bulletEffects";
import {TowerType} from "./towerFacotry";

export default class AOETower extends BaseTowerData {
    //
    //Пушка 2:
    // Наносит одинаковый урон всем целям в радиусе атаки.
    // Урон = 2
    // Радиус атаки = 2.5
    // Скорострельность = 1.5
    // Стоимость = 85

    constructor(state: PlayState) {
        super(state, BulletEffects.damageAOE);
        this._towerType = TowerType.AOE;
        this._radius = 4 * Config.TILE_SIZE;
        this._shootSpeed = 4;
        this._price = 85;
    }
}