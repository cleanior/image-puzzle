import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

function Image() {
    const { id } = useParams() as { id: string };
    const [puzzleSpec, setPuzzleSpec] = useState<PuzzleSpec>({} as PuzzleSpec);
    const [targetImage, setImage] = useState<ImageSpec>({} as ImageSpec);
    useEffect(() => {
        loadImage(id, setImage);
    }, [id]);

    console.log(puzzleSpec);

    return (
        <div>
            {undefined === puzzleSpec.src ?
                <NormalView image={targetImage} /> :
                <PuzzleView spec={puzzleSpec} />
            }
            <div>
                <button onClick={(event) => {
                    const imageElement = document.querySelector("img") as HTMLImageElement;
                    if (null !== imageElement) {
                        setPuzzleSpec((prevState) => {
                            const puzzleSpec = {
                                src: targetImage.src.large,
                                refSrc: targetImage.src.small,
                                originHeight: imageElement.height,
                                originWidth: imageElement.width
                            } as PuzzleSpec;
                            console.log(prevState === puzzleSpec);
                            return puzzleSpec;
                        });

                        document.querySelector("button")?.remove();
                    }
                }}>Play Puzzle</button>
            </div>
        </div >
    );
}

export default Image;