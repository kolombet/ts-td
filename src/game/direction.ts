
export default class Direction {
    public static R: string = "R";
    public static TR: string = "TR";
    public static T: string = "T";
    public static TL: string = "TL";
    public static L: string = "L";
    public static DL: string = "DL";
    public static D: string = "D";
    public static DR: string = "DR";

    public static directionList: any[] = [Direction.L, Direction.TL, Direction.T, Direction.TR, Direction.R, Direction.DR, Direction.D, Direction.DL];

    constructor() {
    }

    public static getList(): any[] {
        return Direction.directionList;
    }
}