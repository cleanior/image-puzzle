import { Component } from "react"
import styles from "./PuzzleView.module.css"
import Canvas from "./puzzle/Canvas";
import Puzzle, { PuzzleSpec } from "./puzzle/Puzzle";
import ShffleButton from "./ShuffleButton";
import PuzzleReferenceView from "./PuzzleReferenceView";
import PuzzlePlayView from "./PuzzlePlayView";
import ShowOrderButton from "./ShowOrderButton";

type PuzzleViewState = {
    enableNumbering: boolean;
    scoreBoardActivated: boolean;
    canvases: Array<Array<Canvas>>;
};

class PuzzleView extends Component<PuzzleSpec, PuzzleViewState> {

    private puzzle: Puzzle;

    constructor(props: PuzzleSpec) {
        super(props);
        console.log('PuzzleView::constructor():props:');
        console.log(props);
        this.state = {
            enableNumbering: false,
            scoreBoardActivated: false,
            canvases: Array<Array<Canvas>>()
        };
        this.bindEventHandlers();
        this.puzzle = new Puzzle(props, this.updateCanvases);
    }

    componentDidMount() {
        console.log("Mounted!!");
        this.puzzle.shuffleCanvases();
        this.puzzle.update();
    }

    componentDidUpdate() {
        console.log("updated!!");
    }

    private initialize = () => {
        if (undefined === this.state.canvases[0]) {
            console.log(this.state.canvases);
            this.puzzle.initialize(5);
            console.log(this.state.canvases);
        }
    }

    private bindEventHandlers = () => {
        this.updateCanvases = this.updateCanvases.bind(this);
        this.toggleNumbering = this.toggleNumbering.bind(this);
    }

    private updateCanvases = (canvases: Array<Array<Canvas>>) => {
        this.setState({ canvases });
    }

    private toggleNumbering = () => {
        this.setState((prev) => {
            const enableNumbering = !prev.enableNumbering;
            return { enableNumbering };
        });
    }

    render() {
        console.log("Rendering!!");

        this.initialize();

        return <div>
            <div>
                <span><PuzzleReferenceView imageSource={this.props.src} /></span>
                <span className={styles.puzzleSpan}>
                    <PuzzlePlayView
                        canvases={this.state.canvases}
                        enableNumbering={this.state.enableNumbering}
                        puzzle={this.puzzle}
                    />
                </span>
            </div>
            <div><ShowOrderButton onClick={this.toggleNumbering} /></div>
            <div><ShffleButton puzzle={this.puzzle} /></div>
        </div>;
    }
};

export default PuzzleView;