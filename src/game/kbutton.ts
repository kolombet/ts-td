import Rectangle from "openfl/geom/Rectangle";
import Button from "starling/display/Button";
import App from "./app";
import TextFormat from "starling/text/TextFormat";
import Align from "starling/utils/Align";
import TextField from "starling/text/TextField";

/** A simple button that uses "scale9grid" with a single texture. */
export default class KButton extends Button {
    public constructor(width: number = 128, height: number = 32) {
        super(App.resources.assets.getTexture("stoneButton"));

        // this.textFormat.font = "DejaVu Sans";
        this.textFormat = this.getFormat();
        this.scale9Grid = new Rectangle(12.5, 12.5, 20, 20);
        this.width = width;
        this.height = height;
    }

    private getFormat() {
        const format = new TextFormat();
        format.font = "DejaVu Sans";
        format.size = 13;
        format.color = 0xFFFFFF;
        // format.horizontalAlign = Align.LEFT;
        // format.verticalAlign = Align.TOP;
        return format;
    }

    public set label(value: string) {
        this.text = value;
    }
}
