import { MutableRefObject, useRef } from "react";
import { ImageSpec } from "./Image";

interface NormalViewProps {
    image: ImageSpec;
    puzzleStartHandler: (image: ImageSpec, originHeight: number, originWidth: number) => void;
}

function NormalView({ image, puzzleStartHandler }: NormalViewProps) {
    const imgRef = useRef() as MutableRefObject<HTMLImageElement>;
    return (
        <div>
            <div>
                <img src={image.src.large} alt={image.alt} ref={imgRef} />
            </div>
            <div>
                <button onClick={() => {
                    const imageElement = imgRef.current;
                    puzzleStartHandler(image, imageElement.height, imageElement.width);
                }}>Play Puzzle
                </button>
            </div>
        </div >
    );
}

export default NormalView;