import Starling from "starling/core/Starling";
import Button from "starling/display/Button";
import Image from "starling/display/Image";
import Sprite from "starling/display/Sprite";
import DisplayObject from "starling/display/DisplayObject";
import TouchEvent from "starling/events/TouchEvent";
import TouchPhase from "starling/events/TouchPhase";
import TextField from "starling/text/TextField";
import Align from "starling/utils/Align";
import Texture from "starling/textures/Texture";
import Config from "./config";
import KPoint from "./KPoint";

export default class GridCell extends Sprite
{
    // private g:Graphics;
    // private bitmap:Bitmap;
    // private canvas:Shape;
    private t:Texture;
    private image:Image;
    
    constructor()
    {
        super();
        this.t = new Texture();
        // this.canvas = new Shape();
        // this.g = this.canvas.graphics;
    }
    
    public getTexture():Texture
    {
        return this.t;
    }
    
    // public drawEmptyTile():void
    // {
    //     this.drawTile(0x0000ff);
    // }
    //
    // public drawOccupiedTile():void
    // {
    //     this.drawTile(0xff00ff);
    // }
    
    public drawTile(borderColor:number = 0xff00ff, fill:boolean = false, fillColor:number = 0xff0000):void
    {
        // let w:number = Config.ISO_TILE_WIDTH;
        // let h:number = Config.ISO_TILE_HEIGHT;
        
        // if (fill)
        // {
        //     this.g.beginFill(fillColor, .5);
        // }
        // this.g.lineStyle(1, borderColor, .5);
        
        // let p1:KPoint = new KPoint(w / 2, 0);
        // let p2:KPoint = new KPoint(w, h / 2);
        // let p3:KPoint = new KPoint(w / 2, h);
        // let p4:KPoint = new KPoint(0, h / 2);
        
        // this.g.moveTo(p1.x, p1.y);
        // this.g.lineTo(p2.x, p2.y);
        // this.g.lineTo(p3.x, p3.y);
        // this.g.lineTo(p4.x, p4.y);
        // this.g.lineTo(p1.x, p1.y);
        // if (fill)
        // {
        //     this.g.endFill();
        // }
        
        // this.bitmap = new Bitmap(new BitmapData(w, h, true));
        // this.bitmap.bitmapData.fillRect(new Rectangle(0, 0, w, h), 0x00000000);
        // this.bitmap.bitmapData.draw(this.canvas);
        // this.t = Texture.fromBitmap(this.bitmap);
    }
}