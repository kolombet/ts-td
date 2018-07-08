import Starling from "starling/core/Starling";
import Image from "starling/display/Image";
import Sprite from "starling/display/Sprite";
import DisplayObject from "starling/display/DisplayObject";
import TouchEvent from "starling/events/TouchEvent";
import TouchPhase from "starling/events/TouchPhase";
import TextField from "starling/text/TextField";
import Align from "starling/utils/Align";
import Texture from "starling/textures/Texture";
import {IDestroyable} from "./interfaces";
import {PlayState} from "./playState";
import KButton from "./kbutton";
import BaseMode from "./baseMode";
import EditorMode from "./editorMode";
import NormalMode from "./normalMode";
import Util from "./util";
import App from "./app";
import BaseTowerData from "./baseTowerData";
import BasicTower from "./basicTower";
import AOETower from "./AOETower";
import FrostTower from "./frostTower";
import TowerState from "./towerState";

export class TowerFactory {
    constructor() {
    }

    public static createBasicTower(state: PlayState): BaseTowerData {
        return new BasicTower(state);
    }

    public static createAOETower(state: PlayState): BaseTowerData {
        return new AOETower(state);
    }

    public static createFrostTower(state: PlayState): BaseTowerData {
        return new FrostTower(state);
    }

    public static generate(state: PlayState, type: TowerType): BaseTowerData {
        if (type == TowerType.BASIC) {
            return new BasicTower(state);
        }
        else if (type == TowerType.AOE) {
            return new AOETower(state);
        }
        else if (type == TowerType.FROST) {
            return new FrostTower(state);
        }
        else {
            throw new Error("wrong tower type");
        }
    }
}

export enum TowerType {
    BASEMENT,
    BASIC,
    AOE,
    FROST,
}