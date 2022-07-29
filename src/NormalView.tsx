import { Dispatch, MutableRefObject, SetStateAction, useRef } from "react";
import { ImageSpec } from "./Image";
import { PuzzleSpec } from "./PuzzleView";

interface Props {
    image: ImageSpec;
    puzzleStartHandler: Dispatch<SetStateAction<PuzzleSpec>>;
}

function NormalView({ image, puzzleStartHandler }: Props) {
    const imgRef = useRef() as MutableRefObject<HTMLImageElement>;
    return (
        <div>
            {undefined !== image.src ?
                <div>
                    <div>
                        <img src={image.src.large} alt={image.alt} ref={imgRef} />
                    </div>
                    <div>
                        <button onClick={(event) => {
                            const imageElement = (imgRef as MutableRefObject<HTMLImageElement>).current;
                            if (null !== imageElement) {
                                puzzleStartHandler((prevState) => {
                                    const puzzleSpec = {
                                        src: image.src.large,
                                        refSrc: image.src.small,
                                        originHeight: imageElement.height,
                                        originWidth: imageElement.width
                                    } as PuzzleSpec;
                                    console.log(prevState === puzzleSpec);
                                    return puzzleSpec;
                                });
                            }
                        }}>Play Puzzle</button>
                    </div>
                </div> :
                <h1> Loading ...</h1>
            }
        </div>
    );
}

export default NormalView;