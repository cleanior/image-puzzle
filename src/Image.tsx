import { useState } from "react";
import NormalView from "./NormalView";
import PuzzleView, { PuzzleSpec } from "./PuzzleView";

export type ImageSpec = {
    src: string;
    alt: string;
};

type ImageProps = {
    targetImage: ImageSpec;
};

function Image({ targetImage }: ImageProps) {
    const [puzzleSpec, setPuzzleSpec] = useState({} as PuzzleSpec);

    console.log(puzzleSpec);

    const puzzleStartHandler = (
        src: string,
        originHeight: number,
        originWidth: number
    ) => {
        const puzzleSpec = {
            src,
            originHeight,
            originWidth
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
                    originWidth={puzzleSpec.originWidth}
                    originHeight={puzzleSpec.originHeight}
                />
            }
        </div >
    );
}

export default Image;