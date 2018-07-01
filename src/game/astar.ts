import KPoint from "./KPoint";
import BinaryHeap from "./BinaryHeap"
import AStarNodeVO from "./astarNodeVO"

export default class AStar {
    private _openHeap: BinaryHeap;
    private _touched: AStarNodeVO[];
    private _grid: AStarNodeVO[][];
    private tcur: AStarNodeVO;
    private currentNode: AStarNodeVO;
    private ret: AStarNodeVO[];
    private neighbors: AStarNodeVO[];
    private neighbor: AStarNodeVO;
    private newG_int: number;
    private i_int: number;
    private j_int: number;

    constructor(grid: any[]) {
        this._touched = [];
        this._grid = grid;
        this._openHeap = new BinaryHeap(this.heapCallback.bind(this));

        for (let row of this._grid) {
            for (let node of row) {
                node.neighbors = new Array<AStarNodeVO>();

                let neighbors: AStarNodeVO[] = this.getNeighbors(this._grid, node)
                for (let neighbor of neighbors) {
                    if (neighbor == null)
                        break;
                    if (!neighbor.isWall)
                        node.neighbors.push(neighbor);	// in demo i focus only on query optimization
                }
            }
        }
    }

    public heapCallback(node: AStarNodeVO): number {
        return node.f_int;
    }

    /**
     *
     * DEBUG ONLY.
     */
    public get evaluatedTiles(): AStarNodeVO[] {
        return this._touched;
    }

    public search(start: AStarNodeVO, end: AStarNodeVO): AStarNodeVO[] {
        this.i_int = 0;
        this.tcur = this._touched[0];
        while (this.tcur) {
            this.tcur.f_int = 0;
            this.tcur.g_int = 0;
            this.tcur.h_int = 0;
            this.tcur.closed = false;
            this.tcur.visited = false;
            this.tcur.parent = null;
            this.tcur.next = null;
            this._touched[this.i_int] = null;

            this.i_int++;
            this.tcur = this._touched[this.i_int];
        }
        this._openHeap.reset();
        this.i_int = 0;	// touched count -- lol, imperative programming (optimizer :()

        this._openHeap.push(start);
        this._touched[this.i_int++] = start;

        while (this._openHeap.size > 0) {
            this.currentNode = this._openHeap.pop();

            if (this.currentNode == end) {
                this.i_int = 0;
                while (this.currentNode.parent) {
                    this.currentNode.parent.next = this.currentNode;
                    this.i_int++;
                    this.currentNode = this.currentNode.parent;
                }
                this.ret = [];
                for (this.j_int = 0; this.currentNode; this.j_int++) {
                    this.ret[this.j_int] = this.currentNode;
                    this.currentNode = this.currentNode.next;
                }
                return this.ret;
            }

            this.currentNode.closed = true;

            for (let neighbor of this.currentNode.neighbors) {
                if (this.neighbor.closed)
                    continue;

                this.newG_int = this.currentNode.g_int + this.currentNode.cost;

                if (!this.neighbor.visited) {

                    this._touched[this.i_int++] = this.neighbor;

                    this.neighbor.visited = true;
                    this.neighbor.parent = this.currentNode;
                    this.neighbor.g_int = this.newG_int;
                    this.neighbor.h_int = this.heuristic(this.neighbor.position, end.position);
                    this.neighbor.f_int = this.newG_int + this.neighbor.h_int;
                    this._openHeap.push(this.neighbor);

                }
                else if (this.newG_int < this.neighbor.g_int) {

                    this.neighbor.parent = this.currentNode;
                    this.neighbor.g_int = this.newG_int;
                    this.neighbor.f_int = this.newG_int + this.neighbor.h_int;

                    this._openHeap.rescoreElement(this.neighbor);
                }
            }
        }
        return null;
    }

    private getNeighbors(grid: any[], node: AStarNodeVO): AStarNodeVO[] {
        let ret: AStarNodeVO[] = [];
        let x_int: number = node.position.x;
        let y_int: number = node.position.y;
        let gridWidth_int: number = grid.length;
        let gridHeight_int: number = grid[x_int].length;
        let id: number;

        if (x_int > 0) {
            ret[id++] = grid[x_int - 1][y_int];
            if (y_int > 0)
                ret[id++] = grid[x_int - 1][y_int - 1];
            if (y_int < gridHeight_int - 1)
                ret[id++] = grid[x_int - 1][y_int + 1];
        }
        if (x_int < gridWidth_int - 1) {
            ret[id++] = grid[x_int + 1][y_int];
            if (y_int > 0)
                ret[id++] = grid[x_int + 1][y_int - 1];
            if (y_int < gridHeight_int - 1)
                ret[id++] = grid[x_int + 1][y_int + 1];
        }
        if (y_int > 0)
            ret[id++] = grid[x_int][y_int - 1];
        if (y_int < gridHeight_int - 1)
            ret[id++] = grid[x_int][y_int + 1];

        return ret;
    }

    private heuristic(pos0: KPoint, pos1: KPoint): number {
        //console.log("pos1 " + pos0.toString())
        let d1: number = Math.floor(pos1.x - pos0.x);
        let d2: number = Math.floor(pos1.y - pos0.y);
        d1 = d1 < 0 ? -d1 : d1;
        d2 = d2 < 0 ? -d2 : d2;
        let diag: number = d1 + d2; // using of this heuristic might result with incorect results, see https://github.com/shdpl/AS3-AStar/pull/1
        return diag;
    }

}