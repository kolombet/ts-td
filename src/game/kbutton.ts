import Rectangle from "openfl/geom/Rectangle";
import Button from "starling/display/Button";
import App from "./app";

/** A simple button that uses "scale9grid" with a single texture. */
export default class KButton extends Button {
    public constructor(width: number = 128, height: number = 32) {
        super(App.resources.assets.getTexture("button_normal"));

        this.textFormat.font = "DejaVu Sans";
        this.scale9Grid = new Rectangle(12.5, 12.5, 20, 20);
        this.width = width;
        this.height = height;
    }

    public set label(value: string) {
        this.text = value;
    }
}
