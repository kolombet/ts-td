import BaseTowerData from "./baseTowerData";
import { PlayState } from "./playState";
import BulletEffects from "./bulletEffects";
import Config from "./config";
import {TowerType} from "./towerFacotry";

export default class FrostTower extends BaseTowerData {
    //Пушка 3:
    //Атакует одну цель, выбирает находящуюся ближе всего к выходу. Выстрел по врагу замедляет его скорость передвижения. Эффект не накладывается больше одного раза.
    // Замедление = 25%
    // Длительность эффекта = 2 сек.
    // Радиус атаки = 1.5 тайла
    // Скорострельность = 0.5 выстр/сек
    // Стоимость = 50
    constructor(state: PlayState) {
        super(state, BulletEffects.slow);
        this._towerType = TowerType.FROST;
        this._radius = 1.5 * Config.TILE_SIZE;
        this._shootSpeed = .5;
        this._price = 50;
    }

}