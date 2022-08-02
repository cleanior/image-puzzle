import { MutableRefObject, useRef } from "react";
import { ImageSpec } from "./Image";

interface NormalViewProps {
    image: ImageSpec;
    puzzleStartHandler: (src: string, originHeight: number, originWidth: number) => void;
}

function NormalView({ image, puzzleStartHandler }: NormalViewProps) {
    const imgRef = useRef() as MutableRefObject<HTMLImageElement>;
    return (
        <div>
            <div>
                <img src={image.src} alt={image.alt} ref={imgRef} />
            </div>
            <div>
                <button onClick={() => {
                    const imageElement = imgRef.current;
                    puzzleStartHandler(image.src, imageElement.height, imageElement.width);
                }}>Play Puzzle
                </button>
            </div>
        </div >
    );
}

export default NormalView;