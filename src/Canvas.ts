import Tile from "./Tile";

class Canvas {
    private offsetX: number;
    private offsetY: number;
    private width: number;
    private height: number;
    private tile: Tile;

    constructor(x: number, y: number, width: number, height: number, tileToMap: Tile) {
        this.offsetX = x;
        this.offsetY = y;
        this.width = width;
        this.height = height;
        this.tile = tileToMap;
    }

    public getOffset() {
        return { x: this.offsetX, y: this.offsetY };
    }

    public setTile(targetTile: Tile) {
        this.tile = targetTile;
    }

    public getWidth() {
        return this.width;
    }

    public getHeight() {
        return this.height;
    }

    public getTile() {
        return this.tile;
    }

    public getTileIndex() {
        return this.tile.getIndex();
    }
};

export default Canvas;