import { Component } from "react"
import styles from "./PuzzleView.module.css"
import Canvas from "./puzzle/Canvas";
import Puzzle, { PuzzleSpec } from "./puzzle/Puzzle";
import ShffleButton from "./ShuffleButton";
import PuzzleReferenceView from "./PuzzleReferenceView";
import PuzzlePlayView from "./PuzzlePlayView";

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
        this.bindEventHandlers();
        this.puzzle = new Puzzle(props, this.updateCanvases);
    }

    componentDidMount() {
        console.log("Mounted!!");
        this.puzzle.update();
    }

    componentDidUpdate() {
        console.log("updated!!");
    }

    private bindEventHandlers = () => {
        this.updateCanvases = this.updateCanvases.bind(this);
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

        return <div>
            <div>
                <span>
                    <PuzzleReferenceView imageSource={this.props.src} />
                </span>
                <span className={styles.puzzleSpan}>{
                    <PuzzlePlayView puzzle={this.puzzle} canvases={this.state.canvases} />
                }</span>
            </div>
            <div>
                <ShffleButton puzzle={this.puzzle} />
            </div>
        </div>;
    }
};

export default PuzzleView;