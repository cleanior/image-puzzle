import { RefObject, useEffect, useRef } from "react";
import Canvas from "./Canvas";
import Puzzle from "./Puzzle";

type CanvasCompProps = {
    puzzle: Puzzle;
    canvas: Canvas;
};

const BASE_MARGIN_IN_PX: number = 10;
const TILE_SCALE_RATIO: number = 0.998;

const CanvasView = ({ puzzle, canvas }: CanvasCompProps) => {
    const canvasRef = useRef() as RefObject<HTMLCanvasElement>;

    useEffect(() => {
        const canvasTag = canvasRef.current as HTMLCanvasElement;
        const canvasWidth = canvas.getWidth();
        const canvasHeight = canvas.getHeight();
        {
            const { x, y } = canvas.getOffset();
            canvasTag.style.position = "absolute";
            canvasTag.style.left = (BASE_MARGIN_IN_PX + x * canvasWidth).toString() + "px";
            canvasTag.style.top = (y * canvasHeight).toString() + "px";
            canvasTag.width = canvasWidth;
            canvasTag.height = canvasHeight;
        }

        const ctx = canvasTag.getContext("2d") as CanvasRenderingContext2D;
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        {
            const tile = canvas.getTile();
            const { x, y } = tile.getOffset();
            const imageWidth = tile.getImageWidth();
            const imageHeight = tile.getImageHeight();
            ctx.scale(TILE_SCALE_RATIO, TILE_SCALE_RATIO);
            ctx.drawImage(tile.getImage(),
                x * imageWidth, y * imageHeight, imageWidth, imageHeight,
                0, 0, canvasWidth, canvasHeight);
        }

    }, [canvas]);

    return <canvas
        onClick={(event) => {
            console.log(event);
            puzzle.moveCanvas(canvas);
            puzzle.update();
        }}
        ref={canvasRef}
    />;
}

export default CanvasView;