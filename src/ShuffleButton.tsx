import Puzzle from "./puzzle/Puzzle";
import styles from "./PuzzleReferenceView.module.css"

type ShuffleButtonProps = {
    puzzle: Puzzle;
    show?: boolean;
}

const ShffleButton = ({ puzzle, show = true }: ShuffleButtonProps) => {
    return show ?
        <button className={styles.refView} onClick={() => {
            puzzle.shuffleCanvases();
            puzzle.update();
        }}>
            Shuffle
        </button> :
        <></>;
}

export default ShffleButton;