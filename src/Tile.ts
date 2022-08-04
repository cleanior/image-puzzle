
class Tile {
    private image: HTMLImageElement;

    private index: number;
    private offsetX: number;
    private offsetY: number;
    private canvasOffsetX: number;
    private canvasOffsetY: number;

    constructor(src: string, index: number, offsetX: number, offsetY: number) {
        this.image = new Image();
        this.image.src = src;

        this.index = index;
        this.offsetX = offsetX;
        this.offsetY = offsetY;

        this.canvasOffsetX = -1;
        this.canvasOffsetY = -1;
    }

    public getImage(): HTMLImageElement {
        return this.image;
    }

    public getIndex() {
        return this.index;
    }

    public getOffset(): { x: number, y: number } {
        return { x: this.offsetX, y: this.offsetY };
    }

    public setCanvasOffset(x: number, y: number) {
        this.canvasOffsetX = x;
        this.canvasOffsetY = y;
    }

    public getCanvasOffset() {
        return { x: this.canvasOffsetX, y: this.canvasOffsetY };
    }
}

export default Tile;