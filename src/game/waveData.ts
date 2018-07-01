import { IDestroyable } from './interfaces'
export default class WaveData implements IDestroyable
{
    public id:number;
    public count:number;
    public health:number;
    public speed:number;
    public spawnDelay:number;
    public reward:number;
    
    constructor()
    {
    }
    
    //TODO interface
    public init(data:any):void
    {
        this.id = data.id;
        this.count = data.count;
        this.health = data.health;
        this.speed = data.speed;
        this.spawnDelay = data.spawnDelay;
        this.reward = data.reward;
    }
    
    public destroy():void
    {
        
    }
}
