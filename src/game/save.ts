import TileData from "./tileData";
import { ISaveLoadable } from "./interfaces";
import { PlayState } from "./playState";


export default class Save {
    constructor() {
    }

    public static save2dTileData(data: any[]): Object {
        let result: any[] = [];
        for (let x: number = 0; x < data.length; x++) {
            let columnToSave: TileData[] = data[x];
            let columnResult: any[] = [];
            for (let y: number = 0; y < columnToSave.length; y++) {
                columnResult.push((columnToSave[y] as ISaveLoadable).save());
            }
            result.push(columnResult);
        }
        return result;
    }

    public static load2dTileData(state: PlayState, data: any[]): any[] {
        let result: any[] = new Array<any>();
        for (let x: number = 0; x < data.length; x++) {
            let columnToLoad: any[] = data[x];
            let columnResult: TileData[] = new Array<TileData>();
            for (let y: number = 0; y < columnToLoad.length; y++) {
                let tdata: TileData = new TileData(state);
                tdata.load(columnToLoad[y]);
                columnResult.push(tdata);
            }
            result.push(columnResult);
        }
        return result;
    }

    public static saveVectTileData(data: TileData[]): Object {
        let result: any[] = [];
        for (let i: number = 0; i < data.length; i++) {
            let res: Object = (<ISaveLoadable>data[i]).save();
            result.push(res);
        }
        return result;
    }

    public static loadVectTileData(state: PlayState, data: any[]): TileData[] {
        let result: TileData[] = new Array<TileData>();
        for (let i: number = 0; i < data.length; i++) {
            let res: TileData = new TileData(state);
            res.load(data[i]);
            result.push(res);
        }
        return result;
    }
}