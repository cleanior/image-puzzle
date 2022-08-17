import { Component } from "react"
import styles from "./PuzzleView.module.css"
import CanvasView from "./CanvasView";
import Canvas from "./Canvas";
import Puzzle, { PuzzleSpec } from "./Puzzle";


export type PuzzleViewState = {
    canvases: Array<Array<Canvas>>;
};

class PuzzleView extends Component<PuzzleSpec, PuzzleViewState> {

    private puzzle: Puzzle;

    constructor(props: PuzzleSpec) {
        super(props);
        console.log('PuzzleView::constructor():props:');
        console.log(props);
        this.state = { canvases: Array<Array<Canvas>>() };
        this.setState = this.setState.bind(this);
        this.puzzle = new Puzzle(props, this.setState);
    }

    componentDidMount() {
        console.log("Mounted!!");
        this.puzzle.update();
    }

    componentDidUpdate() {
        console.log("updated!!");
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
                                <CanvasView key={canvas.getTileIndex()} puzzle={this.puzzle} canvas={canvas} />
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