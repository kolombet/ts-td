
export default class Console {
    private static isLogEnabled: boolean = true;
    private static isInfoEnabled: boolean = false;

    constructor() {
    }

    public static log(str: string): void {
        if (Console.isLogEnabled) {
            Console.debug(str);
        }
    }

    public static info(str: string): void {
        if (Console.isInfoEnabled) {
            //console.log(str);
        }
    }

    public static debug(str: string): void {
        //console.log(str);
    }
}
