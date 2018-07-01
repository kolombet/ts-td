import SingleDamage from "./singleDamage";
import AOEDamage from "./AOEDamage";
import SlowEffect from "./slowEffect";
import Config from "./config";
import NoDamage from "./noDamage";

export default class BulletEffects {
    public static nodamage: NoDamage = new NoDamage();
    public static single: SingleDamage = new SingleDamage(Config.BASIC_TOWER_DAMAGE);
    public static damageAOE: AOEDamage = new AOEDamage(Config.EXPLOSION_TOWER_RADIUS * Config.TILE_SIZE, Config.BASIC_TOWER_DAMAGE);
    public static slow: SlowEffect = new SlowEffect(Config.FREEZE_DURATION, Config.FREEZE_MODIFIER);

    constructor() {
    }
}