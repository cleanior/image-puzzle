import { Component, createRef, RefObject } from "react"
import Tile from "./Tile"
import styles from "./PuzzleView.module.css"

export interface PuzzleSpec {
    src: string;
    originalWidth: number;
    originalHeight: number;
    targetWidth: number;
    targetHeight: number;
}
interface State {
    canvases: Array<HTMLCanvasElement[]>;
}

class PuzzleView extends Component<PuzzleSpec, State> {
    private tileCountX: number;
    private tileCountY: number;
    private tileUnit: number;
    private tileImageUnit: number;
    private tileCountTotal: number;
    private tiles: Array<Tile>;
    private canvasRefs: Array<RefObject<HTMLCanvasElement>>;

    constructor(props: PuzzleSpec) {
        super(props);
        //this.srcLastTile = "https://cdn-icons-png.flaticon.com/512/3413/3413205.png";
        this.tileCountX = 0;
        this.tileCountY = 0;
        this.tileUnit = 0;
        this.tileImageUnit = 0;
        this.tileCountTotal = 0;
        this.tiles = Array<Tile>();

        this.state = { canvases: Array<HTMLCanvasElement[]>() };
        this.canvasRefs = Array<RefObject<HTMLCanvasElement>>();
    }

    public initializeTiles(baselineTileCount: number) {
        console.log("initializeTiles");
        this.estimateTotalTileCount(baselineTileCount);

        let totalIndex: number = 0;
        for (let indexY = 0; indexY < this.tileCountY; indexY++) {
            console.log(this.tiles);
            for (let indexX = 0; indexX < this.tileCountX; indexX++) {
                const sourceUrl: string = //this.src;
                    totalIndex < this.tileCountTotal - 1 ? this.props.src : "";
                const tile: Tile = new Tile(sourceUrl, totalIndex, indexX, indexY);
                this.tiles.push(tile);
                totalIndex++;
            }
        }

        console.log(this.tiles);
    }

    public estimateTotalTileCount(baselineTileCount: number) {
        const targetWidth = this.props.targetWidth;
        const targetHeight = this.props.targetHeight;
        const originalWidth = this.props.originalWidth;
        const originalHeight = this.props.originalHeight;
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

    public initializeCanvases(): Array<HTMLCanvasElement[]> {
        const baseMargin = 10;
        const canvases = Array<HTMLCanvasElement[]>();
        this.tiles.forEach((tile) => {
            if (0 === tile.getIndex() % this.tileCountX) {
                canvases.push(Array<HTMLCanvasElement>());
            }

            const { x, y } = tile.getOffset();
            const tileIndex = tile.getIndex();
            const canvas = this.canvasRefs[tileIndex].current as HTMLCanvasElement;
            canvas.setAttribute("canvasX", x.toString());
            canvas.setAttribute("canvasY", y.toString());
            canvas.setAttribute("tileId", tileIndex.toString());
            tile.setCanvasOffset(x, y);
            canvas.width = this.tileUnit;
            canvas.height = this.tileUnit;
            // 
            canvas.style.position = "absolute";
            canvas.style.left = (baseMargin + x * this.tileUnit).toString() + "px";
            canvas.style.top = (y * this.tileUnit).toString() + "px";
            canvases[y].push(canvas);

            this.drawTileOnCanvas(canvases[y][x], tile);

            console.log(x, y, x * this.tileUnit, y * this.tileUnit,
                canvases[y][x].offsetLeft, canvases[y][x].offsetTop, canvases[y][x].getAttribute("tileId"));
        });
        console.log(canvases);

        return canvases;
    }

    public drawTileOnCanvas(canvas: HTMLCanvasElement, tile: Tile, fitToCanvas: boolean = false) {
        const { x, y } = tile.getOffset();
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        ctx.clearRect(0, 0, this.tileUnit, this.tileUnit);
        ctx.drawImage(tile.getImage(),
            x * this.tileImageUnit, y * this.tileImageUnit, this.tileImageUnit, this.tileImageUnit,
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

    public verifyCompletion() {
        let totalIndex = 0;
        for (let indexY = 0; indexY < this.tileCountY; indexY++) {
            for (let indexX = 0; indexX < this.tileCountX; indexX++) {
                const tileId = parseInt(this.state.canvases[indexY][indexX].getAttribute("tileId") as string);
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

    componentDidMount() {
        console.log("Mounted!!");

        this.setState((prevState, props) => {
            const canvases = this.initializeCanvases();
            return { canvases }
        });
    }

    componentDidUpdate() {
        console.log("updated!!");
    }

    render() {
        console.log("Rendering!!");
        console.log(this.tiles);

        if (undefined === this.tiles[0]) {
            this.initializeTiles(5);
        }

        return (
            <div>
                <div>
                    <span>
                        <img className={styles.refImage} src={this.props.src} alt="" />
                    </span>
                    <span className={styles.puzzleSpan}>{
                        this.tiles.map((tile, index) => (
                            <canvas key={`${tile.getIndex()}`}
                                id={`${tile.getIndex()}`}
                                onClick={(event) => {
                                    console.log(event);
                                    this.setState((prevState, props) => {
                                        const canvas = event.target as HTMLCanvasElement;
                                        const canvasToSwap = this.getSwappableCanvas(canvas);
                                        if (null !== canvasToSwap) {
                                            console.log("swap happens!!!");
                                            const canvases = this.swapCanvases(canvas, canvasToSwap);
                                            this.verifyCompletion();
                                            return { canvases };
                                        }

                                        return null;
                                    });
                                }}
                                ref={this.canvasRefs[index] = createRef()}
                            />
                        ))
                    }</span>
                </div>
                <div>
                    <button onClick={() => {
                        this.shuffleCanvases();
                    }}>Shuffle</button>
                </div>

            </div>
        );
    }
}

export default PuzzleView;