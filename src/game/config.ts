import KPoint from "./KPoint";

export default class Config {
	public static GAME_SPEED_MULTIPLIER = 1;
	public static TILE_SIZE: number = 32;
	public static TILE_SIZE_HALF: number = 16;
	// public static ISO_TILE_HEIGHT: number = 32;
	// public static ISO_TILE_WIDTH: number = 64;
	public static TICK_TIME: number = .1;
	public static BASE_URL: string = "resources/";
	public static LEVEL_RES: string = "level_";
	public static WAVE_RES: string = "wave_";
	public static BACKGROUND_RES: string = Config.BASE_URL + "background_";
	public static RES_FORMAT: string = ".png";
	public static START_LIVES_COUNT: number = 10;
	public static START_MONEY_COUNT: number = 100;
	public static WAVE_DELAY: number = 5;
	public static BULLET_SPEED: number = 3;
	public static MIN_BULLET_DESTROY_DISTANCE: number = 5;
	public static SCENE_SHIFT: number = 200;

    public static GameWidth: number = 375;
    public static GameHeight: number = 667;

    public static CenterX: number = Math.floor(Config.GameWidth / 2);
    public static CenterY: number = Math.floor(Config.GameHeight / 2);

    public static Map: string = "assets/game/backgroundBig.png";
    public static Creeps: string = "assets/game/creeps.png";
    public static CreepsXML: string = "assets/game/creeps.xml";
    public static LevelRes: string = "level.json";
    public static WaveRes: string = "assets/game/wave_0.json";
    public static TowerRes: string = "assets/game/tower.png";
    public static UpgradeButtonFire: string = "assets/game/fire-icon.png";
    public static UpgradeButtonWater: string = "assets/game/water-icon.png";
    public static Basement: string = "assets/game/basement.png";
    public static TestTile: string = "assets/game/test-tile.png";

    public static DEBUG_CREEP_CENTER:boolean = false;
    public static DEBUG_WAVE_AUTOSTART:boolean = true;

    /* Game balance */
	public static BASIC_TOWER_DAMAGE:number = 1;
	public static BASIC_TOWER_RADIUS:number = 4 * Config.TILE_SIZE;
	public static BASIC_TOWER_SHOOT_SPEED:number = 1;
	public static BASIC_TOWER_PRICE:number =  100;

	public static EXPLOSION_TOWER_RADIUS:number = 2.5;
	public static FREEZE_DURATION:number = 2;
	public static FREEZE_MODIFIER:number = .75;

	public static GetPath():KPoint[] {
		const path:KPoint[] = [];
		path.push(new KPoint(2, 0));
        path.push(new KPoint(2, 7));
        path.push(new KPoint(6, 7));
        path.push(new KPoint(6, 10));
        path.push(new KPoint(9, 10));
        path.push(new KPoint(9, 14));
        path.push(new KPoint(12, 14));
        path.push(new KPoint(12, 17));
        path.push(new KPoint(18, 17));
        path.push(new KPoint(18, 14));
        path.push(new KPoint(15, 14));
        path.push(new KPoint(15, 11));
        path.push(new KPoint(12, 11));
        path.push(new KPoint(12, 8));
        path.push(new KPoint(9, 8));
        path.push(new KPoint(9, 4));
        path.push(new KPoint(5, 4));
        path.push(new KPoint(5, 0));
		return path;
	}

	public static GetPathAnd():KPoint[] {
        const path:KPoint[] = [];
        path.push(new KPoint(2, 7));
        path.push(new KPoint(8, 7));
        path.push(new KPoint(8, 14));
        path.push(new KPoint(13, 14));
        path.push(new KPoint(13, 18));
        path.push(new KPoint(18, 18));
        path.push(new KPoint(18, 13));
        path.push(new KPoint(16, 13));
        path.push(new KPoint(16, 11));
        path.push(new KPoint(11, 11));
        path.push(new KPoint(11, 6));
        return path;
    }
	constructor() {
	}
}