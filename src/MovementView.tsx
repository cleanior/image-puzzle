import styles from "./PuzzleReferenceView.module.css";

type MovementViewProps = {
    movementCount: number;
}

const MovementView = ({ movementCount }: MovementViewProps) => {
    return <p className={styles.refView}>#Moves: {movementCount}</p>;
}

export default MovementView;