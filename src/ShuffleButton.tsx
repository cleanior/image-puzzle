import Puzzle from "./puzzle/Puzzle";

type ShuffleButtonProps = {
    puzzle: Puzzle;
    show?: boolean;
}

const ShffleButton = ({ puzzle, show = true }: ShuffleButtonProps) => {
    return show ?
        <button onClick={() => {
            puzzle.shuffleCanvases();
            puzzle.update();
        }}>
            Shuffle
        </button> :
        <></>;
}

export default ShffleButton;