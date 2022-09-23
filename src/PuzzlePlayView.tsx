import CanvasView from "./CanvasView";
import Canvas from "./puzzle/Canvas";
import Puzzle from "./puzzle/Puzzle";

type PuzzlePlayViewProps = {
    canvases: Array<Array<Canvas>>;
    enableNumbering?: boolean;
    puzzle: Puzzle;
}

const PuzzlePlayView = ({ canvases, enableNumbering = false, puzzle }: PuzzlePlayViewProps) => {
    return <>{
        canvases.map((canvasLine) => (
            canvasLine.map((canvas) => (
                <CanvasView
                    key={canvas.getTileIndex()}
                    canvas={canvas}
                    enableNumbering={enableNumbering}
                    onClick={(canvas: Canvas) => {
                        puzzle.moveCanvas(canvas);
                        puzzle.update();
                    }} />
            ))
        ))
    }</>;
}

export default PuzzlePlayView;