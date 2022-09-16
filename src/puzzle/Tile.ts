
class Tile {
    private image: HTMLImageElement;
    private imageWidth: number;
    private imageHeight: number;

    private index: number;
    private offsetX: number;
    private offsetY: number;
    private canvasOffsetX: number;
    private canvasOffsetY: number;

    constructor(index: number,
        offsetX: number, offsetY: number,
        src: string,
        imageWidth = 0, imageHeight = 0) {

        this.image = new Image();
        this.image.src = src;
        this.imageWidth = imageWidth;
        this.imageHeight = imageHeight;

        this.index = index;
        this.offsetX = offsetX;
        this.offsetY = offsetY;

        this.canvasOffsetX = -1;
        this.canvasOffsetY = -1;
    }

    public getImage() {
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

    public getImageWidth() {
        return this.imageWidth;
    }

    public getImageHeight() {
        return this.imageHeight;
    }
}


export default Tile;