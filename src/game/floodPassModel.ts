import {IDestroyable, IPassModel} from "./interfaces";
import TileData from "./tileData";
import KPoint from "./KPoint";
import AStar from "./astar";
import AStarNodeVO from "./astarNodeVO";
import Config from "./config";

export default class FloodPassModel implements IPassModel {
    _grid: Array<Array<TileData>>;

    getPath(startTile: TileData, endTile: TileData): TileData[] {
        let result = [];
        // result.push(this.getTile(7, 3));
        // result.push(this.getTile(10, 17));
        // result.push(this.getTile(18, 19));
        // result.push(this.getTile(17, 15));
        // result.push(this.getTile(12, 12));
        // result.push(this.getTile(11, 7));

        let newPath = Config.GetPathAnd();
        for (let point of newPath) {
            result.push(this.getTile(point.x, point.y));
        }

        console.log("test");
        return result;
    }

    getTile(tileX:number, tileY:number):TileData {
        return this._grid[tileX][tileY];
    }

    getTestPath(): TileData[] {
        let resultList: TileData[] = [];
        let isFound: boolean = false;
        let currentX = 17;
        let currentY = 17;
        let targetX = 0;
        let targetY = 0;

        let swapCheckCount = 0;
        let swapLimit = 10;
        let swapOrder = false;
        resultList.push(this._grid[currentX][currentY]);
        while (!isFound) {
            if (swapOrder == true) {
                if (currentY > targetY) {
                    currentY -= 1;
                    swapCheckCount++;
                    if (swapCheckCount > swapLimit) {
                        swapOrder = !swapOrder;
                        swapCheckCount = 0;
                    }
                    resultList.push(this._grid[currentX][currentY]);
                    continue;
                }
            }

            if (swapOrder == false) {
                currentX -= 1;
                swapCheckCount++;
                if (swapCheckCount > swapLimit) {
                    //console.log("swap");
                    swapOrder = !swapOrder;
                    swapCheckCount = 0;
                }
                resultList.push(this._grid[currentX][currentY]);
            }

            isFound = true;
        }
        resultList.push(this._grid[targetX][targetY]);
        //console.log("get path");
        return resultList;
    }

    getLine(startX, startY, endX, endY) {
        let result: TileData[] = [];
        let dx = endX - startX;
        let dy = endY - startY;
        let xDirection = dx / Math.abs(dx);
        let yDirection = dy / Math.abs(dy);
        while (startX != endX) {
            startX += xDirection;
            result.push(this._grid[startX][startY]);
        }
        while (startY != endY) {
            startY = startY + yDirection;
            result.push(this._grid[startX][startY]);
        }
        return result;
    }

    init(grid: Array<Array<TileData>>): void {
        this._grid = grid;
    }

    destroy() {
        this._grid = null;
    }
}

class PassGraph {
    constructor(parameters) {

    }
}