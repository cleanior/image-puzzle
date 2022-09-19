import CanvasView from "./CanvasView";
import Canvas from "./puzzle/Canvas";
import Puzzle from "./puzzle/Puzzle";

type PuzzlePlayViewProps = {
    puzzle: Puzzle;
    canvases: Array<Array<Canvas>>;
}

const PuzzlePlayView = ({ puzzle, canvases }: PuzzlePlayViewProps) => {
    return <>{
        canvases.map((canvasLine) => (
            canvasLine.map((canvas) => (
                <CanvasView
                    key={canvas.getTileIndex()}
                    canvas={canvas}
                    onClick={(canvas: Canvas) => {
                        puzzle.moveCanvas(canvas);
                        puzzle.update();
                    }} />
            ))
        ))
    }</>;
}

export default PuzzlePlayView;