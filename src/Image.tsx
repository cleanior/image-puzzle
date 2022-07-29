import { useEffect, useState } from "react";
import { loadImage } from "./ImageLoader";
import NormalView from "./NormalView";
import PuzzleView, { PuzzleSpec } from "./PuzzleView";

export interface ImageSpec {
    alt: string;
    avg_color: string;
    height: number;
    id: number;
    liked: false;
    photographer: string;
    photographer_id: number;
    photographer_url: string;
    src: {
        landscape: string;
        large: string;
        large2x: string;
        medium: string;
        original: string;
        portrait: string;
        small: string;
        tiny: string;
    };
    url: string;
    width: number;
}

interface Props {
    id: string;
}

function Image({ id }: Props) {
    const [puzzleSpec, setPuzzleSpec] = useState({} as PuzzleSpec);
    const [targetImage, setImage] = useState({} as ImageSpec);

    useEffect(() => {
        loadImage(id, setImage);
    }, [id]);

    console.log(puzzleSpec);

    return (
        <div>
            {undefined === puzzleSpec.src ?
                <NormalView image={targetImage} puzzleStartHandler={setPuzzleSpec} /> :
                <PuzzleView src={puzzleSpec.src} refSrc={puzzleSpec.refSrc} originWidth={puzzleSpec.originWidth} originHeight={puzzleSpec.originHeight} />
            }
        </div >
    );
}

export default Image;