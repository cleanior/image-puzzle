
class Tile {
    private image: HTMLImageElement;

    private index: number;
    private offsetX: number;
    private offsetY: number;
    private sourceX: number;
    private sourceY: number;
    private sourceWidth: number;
    private sourceHeight: number;
    private canvasOffsetX: number;
    private canvasOffsetY: number;

    constructor(src: string, index: number, sourceX: number, sourceY: number, width: number, height: number) {
        this.image = new Image();
        this.image.src = src;
        this.index = index;
        this.offsetX = -1;
        this.offsetY = -1;

        this.sourceX = sourceX;
        this.sourceY = sourceY;
        this.sourceWidth = width;
        this.sourceHeight = height;
        this.canvasOffsetX = -1;
        this.canvasOffsetY = -1;
    }

    public setOffset(x: number, y: number) {
        this.offsetX = x;
        this.offsetY = y;
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

    public getImage(): HTMLImageElement {
        return this.image;
    }

    public getIndex() {
        return this.index;
    }
}

export default Tile;