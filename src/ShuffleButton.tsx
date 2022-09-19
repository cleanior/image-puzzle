import Puzzle from "./puzzle/Puzzle";

type ShuffleButtonProps = {
    puzzle: Puzzle;
}

const ShffleButton = ({ puzzle }: ShuffleButtonProps) => {
    return <button onClick={() => {
        puzzle.shuffleCanvases();
        puzzle.update();
    }}>
        Shuffle
    </button>;
}

export default ShffleButton;