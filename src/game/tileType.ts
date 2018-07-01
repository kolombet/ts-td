export default class TileType
{
    /**
     * Empty tile. Creeps can pass
     */
    public static FREE:number = 0;
    /**
     * Creeps can't pass
     */
    public static BLOCKED:number = 1;
    /**
     * Player can build tower here + Creeps can't pass
     */
    public static BUILDSITE:number = 2;
    /**
     * Tower build blocked + Creeps can't pass
     */
    public static BUILDING:number = 3;
    
    constructor()
    {
    }
    
    /**
     * returns next tile type
     * @param type - current type
     * @return - new type
     */
    public static getNext(type:number):number
    {
        if (type < 2)
        {
            type++;
        }
        else
        {
            type = 0;
        }
        return type;
    }
}