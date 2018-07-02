import Sprite from "starling/display/Sprite";
import Texture from "starling/textures/Texture";
import Image from "starling/display/Image";

export default class Gauge extends Sprite {
    private _image: Image;
    private _ratio: number;

    constructor(texture: Texture) {
        super();
        this._ratio = 1.0;
        this._image = new Image(texture);

        this.addChild(this._image);
    }

    update(): void {
        this._image.scaleX = this._ratio;
        this._image.setTexCoords(1, this._ratio, 0);
        this._image.setTexCoords(3, this._ratio, 1);
    }

    get ratio(): number {
        return this._ratio;
    }

    set ratio(value: number) {
        if (value == this.ratio)
            return;
        this._ratio = value > 1 ? 1 : (value < 0 ? 0 : value);
        this.update();
    }
}
