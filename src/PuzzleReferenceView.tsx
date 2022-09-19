
import styles from "./PuzzleReferenceView.module.css"

type PuzzleReferenceViewProps = {
    imageSource: string;
}

const PuzzleReferenceView = ({ imageSource }: PuzzleReferenceViewProps) => {
    return <img className={styles.refImage} src={imageSource} alt="" />
}

export default PuzzleReferenceView;