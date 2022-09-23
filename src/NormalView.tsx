import { MutableRefObject, useRef } from "react";
import { ImageSpec } from "./SelectedImage";
import styles from './NormalView.module.css';
import ScoreView from "./scoreboard/ScoreView";

interface NormalViewProps {
    image: ImageSpec;
    puzzleStartHandler: (
        src: string,
        originalWidth: number,
        originalHeight: number,
        targetWidth: number,
        targetHeight: number
    ) => void;
}

const NormalView = ({ image, puzzleStartHandler }: NormalViewProps) => {
    const imgRef = useRef() as MutableRefObject<HTMLImageElement>;
    const scoreCountLimit = 3;
    return (
        <div>
            <div>
                <img className={styles.targetImage} src={image.src} alt={image.alt} ref={imgRef} />
            </div>
            <div>
                <ScoreView countLimit={scoreCountLimit} show={true} src={image.src} />
            </div>
            <div>
                <button onClick={() => {
                    const imageElement = imgRef.current;
                    console.log(`${imageElement.width}x${imageElement.height}`);
                    puzzleStartHandler(
                        image.src,
                        imageElement.naturalWidth,
                        imageElement.naturalHeight,
                        imageElement.width,
                        imageElement.height
                    );
                }}>Play Puzzle
                </button>
            </div>
        </div >
    );
}

export default NormalView;