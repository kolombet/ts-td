import KPoint from "./KPoint";

export default class AStarNodeVO {
    h_int: number; //uint
    f_int: number; //uint
    g_int: number; //uint
    cost: number;
    visited: boolean;
    closed: boolean;
    isWall: boolean;
    position: KPoint;
    parent: AStarNodeVO;
    next: AStarNodeVO;
    neighbors: AStarNodeVO[];

    constructor(cost: number = 1) {
        this.cost = cost;
    }
}