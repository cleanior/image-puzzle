import Canvas from "./Canvas";
import Tile from "./Tile";

export type PuzzleSpec = {
    src: string;
    originalWidth: number;
    originalHeight: number;
    targetWidth: number;
    targetHeight: number;
};

type CanvasesUpdater = (canvases: Array<Array<Canvas>>) => void;
type ScoreUpdater = ((moves: number, numberOfTries: number) => boolean) | null;

class Puzzle {
    private tileCountX: number;
    private tileCountY: number;
    private tileUnit: number;
    private tileImageUnit: number;
    private tileCountTotal: number;
    private totalMovement: number;
    private numberOfTries: number;
    private tiles: Array<Tile>;
    private canvases: Array<Array<Canvas>>;
    private spec: PuzzleSpec;
    private updateCanvases: CanvasesUpdater;
    private updateScore: ScoreUpdater;

    constructor(spec: PuzzleSpec, updateCanvases: CanvasesUpdater, updateScore: ScoreUpdater = null) {
        this.tileCountX = 0;
        this.tileCountY = 0;
        this.tileUnit = 0;
        this.tileImageUnit = 0;
        this.tileCountTotal = 0;
        this.tiles = Array<Tile>();
        this.canvases = Array<Array<Canvas>>();
        this.spec = spec;
        this.updateCanvases = updateCanvases;
        this.totalMovement = 0;
        this.numberOfTries = 0;
        this.updateScore = updateScore;
    }

    public update() {
        this.updateCanvases(this.canvases);
    }

    public currentMovementCount() {
        return this.totalMovement;
    }

    public initialize(baselineTileCount: number) {
        this.initializeTiles(baselineTileCount);
        this.initializeCanvases();
        this.numberOfTries = 0;
    }

    private initializeTiles(baselineTileCount: number) {
        console.log("initializeTiles");
        this.estimateTotalTileCount(baselineTileCount);

        let totalIndex: number = 0;
        for (let indexY = 0; indexY < this.tileCountY; indexY++) {
            for (let indexX = 0; indexX < this.tileCountX; indexX++) {
                const imageUrl = //this.src;
                    totalIndex < this.tileCountTotal - 1 ? this.spec.src : "";
                const tile = new Tile(totalIndex, indexX, indexY,
                    imageUrl, this.tileImageUnit, this.tileImageUnit);
                this.tiles.push(tile);
                totalIndex++;
            }
        }

        console.log('Puzzle::initializeTiles()');
        console.log(this.tiles);
    }

    private estimateTotalTileCount(baselineTileCount: number) {
        const targetWidth = this.spec.targetWidth;
        const targetHeight = this.spec.targetHeight;
        const originalWidth = this.spec.originalWidth;
        const originalHeight = this.spec.originalHeight;
        if (targetWidth <= targetHeight) {
            this.tileUnit = Math.floor(targetWidth / baselineTileCount);
            this.tileImageUnit = Math.floor(originalWidth / baselineTileCount);
            this.tileCountX = baselineTileCount;
            this.tileCountY = Math.floor(targetHeight / this.tileUnit);
        }
        else {
            this.tileUnit = Math.floor(targetHeight / baselineTileCount);
            this.tileImageUnit = Math.floor(originalHeight / baselineTileCount);
            this.tileCountX = Math.floor(targetWidth / this.tileUnit);
            this.tileCountY = baselineTileCount;
        }

        console.log(`${this.tileCountX} x ${this.tileCountY}: ${this.tileUnit} `);
        this.tileCountTotal = this.tileCountX * this.tileCountY;
        return this.tileCountTotal;
    }

    private initializeCanvases(): Array<Array<Canvas>> {
        const canvases = this.canvases;

        this.tiles.forEach((tile) => {
            if (0 === tile.getIndex() % this.tileCountX) {
                canvases.push(Array<Canvas>());
            }

            const { x, y } = tile.getOffset();
            const width = this.tileUnit;
            const height = this.tileUnit;
            const canvas = new Canvas(x, y, width, height, tile);

            tile.setCanvasOffset(x, y);

            canvases[y].push(canvas);
        });
        console.log(canvases);

        return canvases;
    }

    private isCanvasWithLastTile(canvas: Canvas) {
        const tileIndex = canvas.getTileIndex();
        return tileIndex === (this.tileCountTotal - 1);
    }

    public moveCanvas(selectedCanvas: Canvas) {
        const canvasToSwap = this.getSwappableCanvas(selectedCanvas);
        if (null !== canvasToSwap) {
            console.log("swap happens!!!");
            this.totalMovement++;
            this.swapCanvases(selectedCanvas, canvasToSwap);
            if (this.verifyCompletion()) {
                if (this.updateScore) {
                    const moves = this.totalMovement;
                    this.updateScore(moves, this.numberOfTries);
                }
            }
        }

        return this.totalMovement;
    }

    private swapCanvases(
        canvas1: Canvas,
        canvas2: Canvas): Array<Array<Canvas>> {

        const canvas1Offset = canvas1.getOffset();
        const canvas2Offset = canvas2.getOffset();
        const tile1 = canvas1.getTile();
        const tile2 = canvas2.getTile();

        canvas1.setTile(tile2);
        tile2.setCanvasOffset(canvas1Offset.x, canvas1Offset.y);

        canvas2.setTile(tile1);
        tile1.setCanvasOffset(canvas2Offset.x, canvas2Offset.y);

        return this.canvases;
    }

    private getSwappableCanvas(canvas: Canvas): Canvas | null {
        const { x, y } = canvas.getOffset();

        if (0 > x || x >= this.tileCountX ||
            0 > y || y >= this.tileCountY) {
            console.log(`getSwappableCanvas:Invalid coordidate: x: ${x}, y: ${y}`);
            return null;
        }

        // up
        let candidateY = y - 1;
        if (0 <= candidateY && candidateY < this.tileCountY) {
            const canvas = this.canvases[candidateY][x];
            if (this.isCanvasWithLastTile(canvas)) {
                return canvas;
            }
        }

        // down
        candidateY = y + 1;
        if (0 <= candidateY && candidateY < this.tileCountY) {
            const canvas = this.canvases[candidateY][x];
            if (this.isCanvasWithLastTile(canvas)) {
                return canvas;
            }
        }

        // left
        let candidateX = x - 1;
        if (0 <= candidateX && candidateX < this.tileCountX) {
            const canvas = this.canvases[y][candidateX];
            if (this.isCanvasWithLastTile(canvas)) {
                return canvas;
            }
        }

        // right
        candidateX = x + 1;
        if (0 <= candidateX && candidateX < this.tileCountX) {
            const canvas = this.canvases[y][candidateX];
            if (this.isCanvasWithLastTile(canvas)) {
                return canvas;
            }
        }

        console.log("getSwappableCanvas: No swappable canvases.");
        return null;
    }

    public shuffleCanvases() {
        let swapCount = 0;
        const lastTile = this.tiles[this.tileCountTotal - 1];
        while (swapCount < this.tileCountTotal * this.tileCountTotal) {
            const { x, y } = lastTile.getCanvasOffset();
            //console.log(`Last Canvas: (${x}, ${y})`)
            let targetCanvasX = x;
            let targetCanvasY = y;
            let divination = Math.floor(Math.random() * 2);
            // x or y
            if (0 === divination) {
                divination = Math.floor(Math.random() * 2);
                if (0 === divination) {
                    if (this.tileCountX <= targetCanvasX + 1) {
                        targetCanvasX--;
                    } else {
                        targetCanvasX++;
                    }
                } else {
                    if (0 > targetCanvasX - 1) {
                        targetCanvasX++;
                    }
                    else {
                        targetCanvasX--;
                    }
                }
            } else {
                divination = Math.floor(Math.random() * 2);
                if (0 === divination) {
                    if (this.tileCountY <= targetCanvasY + 1) {
                        targetCanvasY--;
                    } else {
                        targetCanvasY++;
                    }
                } else {
                    if (0 > targetCanvasY - 1) {
                        targetCanvasY++;
                    }
                    else {
                        targetCanvasY--;
                    }
                }
            }

            const lastCanvas = this.canvases[y][x];
            const targetCanvas = this.canvases[targetCanvasY][targetCanvasX];
            this.swapCanvases(lastCanvas, targetCanvas);
            swapCount++;
        }

        this.totalMovement = 0;
        this.numberOfTries++;
    }

    private verifyCompletion() {
        let totalIndex = 0;
        for (let indexY = 0; indexY < this.tileCountY; indexY++) {
            for (let indexX = 0; indexX < this.tileCountX; indexX++) {
                const tileId = this.canvases[indexY][indexX].getTileIndex();
                if (tileId === totalIndex) {
                    totalIndex++;
                }
                else {
                    return false;
                }
            }
        }
        console.log("Congrats!!!!!!!!!!!");
        return true;
    }
};

export default Puzzle;