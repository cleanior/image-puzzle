
import styles from "./PuzzleReferenceView.module.css"

type PuzzleReferenceViewProps = {
    imageSource: string;
}

const PuzzleReferenceView = ({ imageSource }: PuzzleReferenceViewProps) => {
    return <img className={styles.refView} src={imageSource} alt="" />
}

export default PuzzleReferenceView;