import { IMode } from "./interfaces";
import { PlayState } from "./playState";

export default class BaseMode implements IMode {
    constructor() {
    }

    public activate(state: PlayState, data: Object = null): void {
    }

    public deactivate(): void {
    }
}