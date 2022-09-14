import { useState } from "react";
import NormalView from "./NormalView";
import { PuzzleSpec } from "./Puzzle";
import PuzzleView from "./PuzzleView";

export type ImageSpec = {
    src: string;
    alt: string;
};

type ImageProps = {
    targetImage: ImageSpec;
};

const SelectedImage = ({ targetImage }: ImageProps) => {
    const [puzzleSpec, setPuzzleSpec] = useState({} as PuzzleSpec);

    console.log(puzzleSpec);

    const puzzleStartHandler = (
        src: string,
        originalWidth: number,
        originalHeight: number,
        targetWidth: number,
        targetHeight: number
    ) => {
        const puzzleSpec = {
            src,
            originalWidth,
            originalHeight,
            targetWidth,
            targetHeight
        } as PuzzleSpec;
        setPuzzleSpec(() => (puzzleSpec));
    };

    return (
        <div>
            {undefined === puzzleSpec.src ?
                <NormalView
                    image={targetImage}
                    puzzleStartHandler={puzzleStartHandler}
                /> :
                <PuzzleView
                    src={puzzleSpec.src}
                    originalWidth={puzzleSpec.originalWidth}
                    originalHeight={puzzleSpec.originalHeight}
                    targetWidth={puzzleSpec.targetWidth}
                    targetHeight={puzzleSpec.targetHeight}
                />
            }
        </div >
    );
}

export default SelectedImage;