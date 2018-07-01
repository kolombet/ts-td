import BaseTowerData from "./baseTowerData";
import { PlayState } from "./playState";
import BulletEffects from "./bulletEffects";
import Config from "./config";
import {TowerType} from "./towerFacotry";

export default class BasicTower extends BaseTowerData {
    /*
        Пушка 1:
         Атакует одну цель, выбирает находящуюся ближе всего к выходу.
         Урон = 4
         Радиус атаки = 4 тайла
         Скорострельность = 1.5 выстр/сек
         Стоимость = 100
        */

    constructor(state: PlayState) {
        super(state, BulletEffects.single);

        this._towerType = TowerType.BASIC;
        this._radius = Config.BASIC_TOWER_RADIUS;
        this._shootSpeed = Config.BASIC_TOWER_SHOOT_SPEED;
        this._price = Config.BASIC_TOWER_PRICE;
    }
}