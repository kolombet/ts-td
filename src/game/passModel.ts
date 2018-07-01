import { IDestroyable, IPassModel } from "./interfaces";
import TileData from "./tileData";
import KPoint from "./KPoint";
import AStar from "./astar";
import AStarNodeVO from "./astarNodeVO";

export default class PassModel implements IPassModel {
    private _astar: AStar;
    private _aStarNodes: any[];
    private _grid: any[];

    constructor() {
    }

    public getPath(startTile: TileData, endTile: TileData): TileData[] {
        let size: number = this._aStarNodes[0].length;
        let path: AStarNodeVO[];
        let startNode: AStarNodeVO = this._aStarNodes[startTile.gridX][startTile.gridY];
        let endNode: AStarNodeVO = this._aStarNodes[endTile.gridX][endTile.gridY];
        path = this._astar.search(startNode, endNode);

        let pathData: TileData[] = new Array<TileData>();
        for (let i: number = 0; i < path.length; i++) {
            let p: KPoint = path[i].position;
            pathData.push(this._grid[p.x][p.y]);
        }
        return pathData;
    }

    public init(grid: Array<Array<TileData>>): void {
        this._grid = grid;
        this.initNodesForAStar();
        this._astar = new AStar(this._aStarNodes);
    }

    private initNodesForAStar(): void {
        this._aStarNodes = new Array<any>();

        let x: number = 0;
        let z: number = 0;

        while (x < this._grid.length) {
            this._aStarNodes[x] = new Array<AStarNodeVO>();

            while (z < this._grid[x].length) {
                let tile: TileData = this._grid[x][z];
                let node: AStarNodeVO = new AStarNodeVO();
                node.h_int = 0;
                node.f_int = 0;
                node.g_int = 0;
                node.visited = false;
                node.parent = null;
                node.closed = false;
                node.isWall = tile.isOccupied;
                node.position = new KPoint(x, z);
                this._aStarNodes[x][z] = node;

                z++;
            }
            z = 0;
            x++;
        }
    }

    public destroy(): void {
        this._astar = null;
        this._aStarNodes = null;
        this._grid = null;
    }
}