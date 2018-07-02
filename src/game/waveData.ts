import { IDestroyable } from './interfaces'
export default class WaveData implements IDestroyable
{
    public static counter:number = 0;
    public id:number;
    public count:number;
    public health:number;
    public speed:number;
    public spawnDelay:number;
    public reward:number;
    
    constructor()
    {
    }

    public static create(count:number, health:number, speed:number, spawnDelay:number, reward:number):WaveData {
        const wave = new WaveData();
        wave.id = this.counter;
        this.counter++;
        wave.count = count;
        wave.health = health;
        wave.speed = speed;
        wave.spawnDelay = spawnDelay;
        wave.reward = reward;
        return wave;
    }
    
    // //TODO interface
    // public init(data:any):void
    // {
    //     this.id = data.id;
    //     this.count = data.count;
    //     this.health = data.health;
    //     this.speed = data.speed;
    //     this.spawnDelay = data.spawnDelay;
    //     this.reward = data.reward;
    // }
    
    public destroy():void
    {
        
    }
}
