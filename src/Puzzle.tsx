import { Component, ReactNode } from "react"
import { PuzzleSpec } from "./PuzzleView";
import Tile from "./Tile"

interface State {
    canvases: (HTMLCanvasElement[])[];
}

class Puzzle extends Component<PuzzleSpec, State> implements PuzzleSpec {
    src: string;
    refSrc: string;
    originWidth: number;
    originHeight: number;

    private tileCountX: number;
    private tileCountY: number;
    private tileUnit: number;
    private tileCountTotal: number;
    private tiles: Array<Tile>;

    constructor(props: PuzzleSpec) {
        super(props);
        this.src = props.src;
        this.refSrc = props.refSrc;
        this.originHeight = props.originHeight;
        this.originWidth = props.originWidth;
        //this.srcLastTile = "https://cdn-icons-png.flaticon.com/512/3413/3413205.png";
        this.tileCountX = 0;
        this.tileCountY = 0;
        this.tileUnit = 0;
        this.tileCountTotal = 0;
        this.tiles = Array<Tile>();

        this.state = { canvases: Array<HTMLCanvasElement[]>() };
    }

    public initializeTiles(baselineTileCount: number) {
        console.log("initializeTiles");
        this.estimateTotalTileCount(baselineTileCount);

        let totalIndex: number = 0;
        for (let indexY = 0; indexY < this.tileCountY; indexY++) {
            console.log(this.tiles);
            for (let indexX = 0; indexX < this.tileCountX; indexX++) {
                const sourceUrl: string = //this.src;
                    totalIndex < this.tileCountTotal - 1 ? this.src : "";
                const sourceX: number = this.tileUnit * indexX;
                const sourceY: number = this.tileUnit * indexY;
                const width: number = this.tileUnit;
                const height: number = this.tileUnit;
                const tile: Tile = new Tile(sourceUrl, totalIndex, sourceX, sourceY, width, height);
                tile.setOffset(indexX, indexY);
                this.tiles.push(tile);
                totalIndex++;
            }
        }

        console.log(this.tiles);
    }

    public estimateTotalTileCount(baselineTileCount: number) {
        if (this.originWidth <= this.originHeight) {
            this.tileUnit = Math.floor(this.originWidth / baselineTileCount);
            this.tileCountX = baselineTileCount;
            this.tileCountY = Math.floor(this.originHeight / this.tileUnit);
        }
        else {
            this.tileUnit = Math.floor(this.originHeight / baselineTileCount);
            this.tileCountX = Math.floor(this.originHeight / this.tileUnit);
            this.tileCountY = baselineTileCount;
        }

        console.log(`${this.tileCountX} x ${this.tileCountY}: ${this.tileUnit} `);
        this.tileCountTotal = this.tileCountX * this.tileCountY;
        return this.tileCountTotal;
    }

    public initializeCanvases(): Array<HTMLCanvasElement[]> {
        const baseMargin = 150;
        const canvasArray: HTMLCanvasElement[] =
            Array.prototype.slice.call(document.querySelectorAll<HTMLCanvasElement>(".tile"));
        const canvases = Array<HTMLCanvasElement[]>();
        this.tiles.forEach((tile) => {
            if (0 === tile.getIndex() % this.tileCountX) {
                canvases.push(Array<HTMLCanvasElement>());
            }

            const { x, y } = tile.getOffset();
            const tileIndex = tile.getIndex();
            canvasArray[tileIndex].setAttribute("canvasX", x.toString());
            canvasArray[tileIndex].setAttribute("canvasY", y.toString());
            canvasArray[tileIndex].setAttribute("tileId", tileIndex.toString());
            tile.setCanvasOffset(x, y);
            canvasArray[tileIndex].width = this.tileUnit;
            canvasArray[tileIndex].height = this.tileUnit;
            // 
            canvasArray[tileIndex].style.position = "absolute";
            canvasArray[tileIndex].style.left = (baseMargin + x * this.tileUnit).toString() + "px";
            canvasArray[tileIndex].style.top = (y * this.tileUnit).toString() + "px";
            canvases[y].push(canvasArray[tileIndex]);

            this.drawTileOnCanvas(canvases[y][x], tile);

            console.log(x, y, x * this.tileUnit, y * this.tileUnit,
                canvases[y][x].offsetLeft, canvases[y][x].offsetTop, canvases[y][x].getAttribute("tileId"));
        });
        console.log(canvases);

        return canvases;
    }

    public drawTileOnCanvas(canvas: HTMLCanvasElement, tile: Tile, fitToCanvas: boolean = false) {
        const { x, y } = tile.getOffset();
        const ctx = canvas.getContext("2d");
        ctx?.clearRect(0, 0, this.tileUnit, this.tileUnit);
        ctx?.drawImage(tile.getImage(),
            x * this.tileUnit, y * this.tileUnit, this.tileUnit, this.tileUnit,
            0, 0, this.tileUnit, this.tileUnit);
    }

    public isCanvasWithLastTile(canvas: HTMLCanvasElement) {
        const tileIndex = parseInt(canvas.getAttribute("tileId") as string);
        return tileIndex === (this.tileCountTotal - 1);
    }

    public swapCanvases(
        canvas1: HTMLCanvasElement,
        canvas2: HTMLCanvasElement): Array<HTMLCanvasElement[]> {

        const canvas1x = parseInt(canvas1.getAttribute("canvasX") as string);
        const canvas1y = parseInt(canvas1.getAttribute("canvasY") as string);
        const canvas2x = parseInt(canvas2.getAttribute("canvasX") as string);
        const canvas2y = parseInt(canvas2.getAttribute("canvasY") as string);

        let tile1Id = parseInt(canvas1.getAttribute("tileId") as string);
        const tile1 = this.tiles[tile1Id];
        let tile2Id = parseInt(canvas2.getAttribute("tileId") as string);
        const tile2 = this.tiles[tile2Id];

        this.drawTileOnCanvas(canvas1, tile2);
        canvas1.setAttribute("tileId", tile2Id.toString());
        tile1.setCanvasOffset(canvas2x, canvas2y);

        this.drawTileOnCanvas(canvas2, tile1);
        canvas2.setAttribute("tileId", tile1Id.toString());
        tile2.setCanvasOffset(canvas1x, canvas1y);

        return this.state.canvases;
    }

    public getSwappableCanvas(canvas: HTMLCanvasElement): HTMLCanvasElement | null {
        const canvasX = parseInt(canvas.getAttribute("canvasX") as string);
        const canvasY = parseInt(canvas.getAttribute("canvasY") as string);

        if (0 > canvasX || canvasX >= this.tileCountX ||
            0 > canvasY || canvasY >= this.tileCountY) {
            console.log(`getSwappableCanvas:Invalid coordidate: x: ${canvasX}, y: ${canvasY}`);
            return null;
        }

        // up
        let candidateY = canvasY - 1;
        if (0 <= candidateY && candidateY < this.tileCountY) {
            const canvas = this.state.canvases[candidateY][canvasX];
            if (this.isCanvasWithLastTile(canvas)) {
                return canvas;
            }
        }

        // down
        candidateY = canvasY + 1;
        if (0 <= candidateY && candidateY < this.tileCountY) {
            const canvas = this.state.canvases[candidateY][canvasX];
            if (this.isCanvasWithLastTile(canvas)) {
                return canvas;
            }
        }

        // left
        let candidateX = canvasX - 1;
        if (0 <= candidateX && candidateX < this.tileCountX) {
            const canvas = this.state.canvases[canvasY][candidateX];
            if (this.isCanvasWithLastTile(canvas)) {
                return canvas;
            }
        }

        // right
        candidateX = canvasX + 1;
        if (0 <= candidateX && candidateX < this.tileCountX) {
            const canvas = this.state.canvases[canvasY][candidateX];
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

            const lastCanvas = this.state.canvases[y][x];
            const targetCanvas = this.state.canvases[targetCanvasY][targetCanvasX];
            this.swapCanvases(lastCanvas, targetCanvas);
            swapCount++;
        }
    }

    componentDidMount() {
        console.log("Mounted!!");
        this.setState((prevState, props) => {
            const canvases: Array<HTMLCanvasElement[]> = this.initializeCanvases();
            return { canvases };
        });
    }

    componentDidUpdate() {
        console.log("updated!!");
    }

    render(): ReactNode {
        console.log("Rendering!!");
        console.log(this.tiles);

        if ("undefined" == typeof this.tiles[0]) {
            this.initializeTiles(5);
        }

        return (
            <div>
                <div>{
                    this.tiles.map((tile) => (
                        <canvas key={tile.getIndex().toString()}
                            className="tile"
                            id={`${tile.getIndex()}`}
                            onClick={(event) => {
                                console.log(event);
                                this.setState((prevState, props) => {
                                    const canvas = event.target as HTMLCanvasElement;
                                    const canvasToSwap = this.getSwappableCanvas(canvas);
                                    if (null !== canvasToSwap) {
                                        console.log("swap happens!!!");
                                        const canvases = this.swapCanvases(canvas, canvasToSwap);
                                        return { canvases };
                                    }
                                });
                            }}
                        />
                    ))
                }</div>
                <div>
                    <button onClick={() => {
                        console.log("new button");
                        this.shuffleCanvases();
                        //console.log(this.state.canvases);
                    }}>Shuffle</button>
                </div>
            </div>
        );
    }
}

export default Puzzle;