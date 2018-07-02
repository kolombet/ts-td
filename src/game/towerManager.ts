import Signal from "./Signal";
import {IAnimatable, IDestroyable} from "./interfaces";
import PlayState from "./playState";
import TileData from "./tileData";
import TileType from "./tileType";
import BaseTowerData from "./baseTowerData";
import Console from "./console";
import KPoint from "./KPoint";
import BasementTower from "./basementTower";
import {TowerFactory} from "./towerFacotry";

export default class TowerManager implements IDestroyable, IAnimatable {
    get onTowerSpawned(): Signal {
        return this._onTowerSpawned;
    }

    private _state: PlayState;
    private _collection: BaseTowerData[];
    private _onTowerSpawned: Signal;
    public onTowerDestroyed:Signal;
    public onTowerUpgradeRequest: Signal;

    constructor(state: PlayState) {
        this._collection = [];
        this._onTowerSpawned = new Signal(BaseTowerData);
        this.onTowerDestroyed = new Signal(BaseTowerData);
        this.onTowerUpgradeRequest = new Signal(BaseTowerData);
        this._state = state;
    }

    public findAllBasements() {
        const map = this._state.map;
        this._collection = map.findAllBasements();
        for (let basement of this._collection) {
            this._onTowerSpawned.dispatch(basement);
        }
        console.log("found basements")
    }

    public advanceTime(time: number): void {
        for (let i: number = 0, l: number = this._collection.length; i < l; i++) {
            this._collection[i].advanceTime(time);
        }
    }

    public buildTowerByCoords(tower: BaseTowerData, coordX: number, coordY: number): boolean {
        let targetTile: TileData = this._state.map.data[coordX][coordY];
        if (targetTile != null) {
            return this.buildTowerByTile(targetTile, tower);
        }
        return false;
    }

    public isAbleToBuildTower(targetTile: TileData): boolean {
        return (targetTile.tileType == TileType.BUILDSITE);
    }

    public findAjacentTiles(tileData: TileData) {
        const tiles = [];

        tiles.push(tileData);
        tiles.push(this.getTile(tileData.gridX + 1, tileData.gridY - 1));
        tiles.push(this.getTile(tileData.gridX + 1, tileData.gridY));
        tiles.push(this.getTile(tileData.gridX + 1, tileData.gridY + 1));
        tiles.push(this.getTile(tileData.gridX, tileData.gridY + 1));
        tiles.push(this.getTile(tileData.gridX - 1, tileData.gridY + 1));
        tiles.push(this.getTile(tileData.gridX - 1, tileData.gridY));
        tiles.push(this.getTile(tileData.gridX - 1, tileData.gridY - 1));
        tiles.push(this.getTile(tileData.gridX, tileData.gridY - 1));

        const freeTiles = tiles.filter((tileData: TileData) => {
            return tileData.tileType == TileType.BUILDSITE;
        });
        console.log("free tiles " + freeTiles.length);
        return freeTiles;
    }

    public buildTowerByTile(targetTile: TileData, tower: BaseTowerData): boolean {
        // if (this.isAbleToBuildTower(targetTile));

        if (this._state.money < tower.price) {
            Console.debug("not enough money");
            return false;
        }
        this._state.money -= tower.price;

        tower.targetTiles = this.findAjacentTiles(targetTile);
        Console.log("tower placed " + tower.x + " " + tower.y);
        this._onTowerSpawned.dispatch(tower);
        this._collection.push(tower);

        return true;
    }

    private blockTile(targetX: number, targetY: number): void {
        let tile: TileData = this._state.map.data[targetX][targetY];
        tile.tileType = TileType.BUILDING;
    }

    private getTile(targetX: number, targetY: number): void {
        return this._state.map.data[targetX][targetY];
    }

    public destroy(): void {
        this._state = null;
        for (let i: number = 0; i < this._collection.length; i++) {
            this._collection[i].destroy();
        }
        this._onTowerSpawned.removeAll();
        this._onTowerSpawned = null;
    }

    public getTowerByCoordinates(point: TileData): BaseTowerData {
        for (let i: number = 0, l: number = this._collection.length; i < l; i++) {
            const tower = this._collection[i];
            const tiles: TileData[] = tower.targetTiles;
            for (const tile of tiles) {
                const isEqual = tile.gridX == point.gridX && tile.gridY == point.gridY;
                if (isEqual)
                    return tower;
            }
        }

        return null;
    }

    public activateTowerUpgrade(towerData: BaseTowerData): void {
        this.onTowerUpgradeRequest.dispatch(towerData);
    }

    public upgradeTower(towerData: BaseTowerData) {
        if (towerData instanceof BasementTower) {
            const newTower = TowerFactory.createBasicTower(this._state);
            if (newTower.price > this._state.money) {
                //TODO: write not enough money
                return;
            }
            this._state.money -= newTower.price;

            const index = this._collection.indexOf(towerData);
            this._collection.splice(index, 1);
            newTower.targetTiles = towerData.targetTiles;
            this.onTowerDestroyed.dispatch(towerData);
            this._onTowerSpawned.dispatch(newTower);
            this._collection.push(newTower);
        }
    }
}