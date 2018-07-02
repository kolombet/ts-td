export default class AtlasData {
    public name:string;
    public pngURL:string;
    public xmlURL:string;

    constructor(name:string) {
        this.name = name;
        this.pngURL = `assets/sheets/${name}.png`;
        this.xmlURL = `assets/sheets/${name}.xml`;
    }

    static getAtlasMap(): AtlasData {
        return new AtlasData("map");
    }
}
