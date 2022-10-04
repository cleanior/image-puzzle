import styles from "./PuzzleReferenceView.module.css"

interface ShowOrderButtonProps {
    onClick: () => void;
    show?: boolean;
}

const ShowOrderButton = ({ onClick, show = true }: ShowOrderButtonProps) => {
    return show ? <button className={styles.refView} onClick={onClick}>Show Order</button> : <></>;
}

export default ShowOrderButton;