import { Component } from "react"
import styles from "./PuzzleView.module.css"
import CanvasView from "./CanvasView";
import Canvas from "./puzzle/Canvas";
import Puzzle, { PuzzleSpec } from "./puzzle/Puzzle";

type PuzzleViewState = {
    canvases: Array<Array<Canvas>>;
};

class PuzzleView extends Component<PuzzleSpec, PuzzleViewState> {

    private puzzle: Puzzle;

    constructor(props: PuzzleSpec) {
        super(props);
        console.log('PuzzleView::constructor():props:');
        console.log(props);
        this.state = { canvases: Array<Array<Canvas>>() };
        this.updateCanvases = this.updateCanvases.bind(this);
        this.puzzle = new Puzzle(props, this.updateCanvases);
        this.onCanvasClick = this.onCanvasClick.bind(this);
    }

    componentDidMount() {
        console.log("Mounted!!");
        this.puzzle.update();
    }

    componentDidUpdate() {
        console.log("updated!!");
    }

    private onCanvasClick = (canvas: Canvas) => {
        this.puzzle.moveCanvas(canvas);
        this.puzzle.update();
    }

    private updateCanvases = (canvases: Array<Array<Canvas>>) => {
        this.setState({ canvases });
    }

    render() {
        console.log("Rendering!!");

        if (undefined === this.state.canvases[0]) {
            console.log(this.state.canvases);
            this.puzzle.initialize(5);
            console.log(this.state.canvases);
        }

        return (
            <div>
                <div>
                    <span>
                        <img className={styles.refImage} src={this.props.src} alt="" />
                    </span>
                    <span className={styles.puzzleSpan}>{
                        this.state.canvases.map((canvasLine) => (
                            canvasLine.map((canvas) => (
                                <CanvasView key={canvas.getTileIndex()} canvas={canvas} onClick={this.onCanvasClick} />
                            ))
                        ))
                    }</span>
                </div>
                <div>
                    <button onClick={() => {
                        this.puzzle.shuffleCanvases();
                        this.puzzle.update();
                    }}>Shuffle</button>
                </div>

            </div>
        );
    }
};

export default PuzzleView;