import Puzzle from "./Puzzle"

export interface PuzzleSpec {
    src: string;
    refSrc: string;
    originWidth: number;
    originHeight: number;
}

interface Props {
    spec: PuzzleSpec;
}

function PuzzleView({ spec }: Props) {

    return (
        <div>
            <div>
                <img src={spec.refSrc} alt="" />
            </div>
            <Puzzle src={spec.src} refSrc={spec.refSrc} originWidth={spec.originWidth} originHeight={spec.originHeight} />
        </div>
    );
}

export default PuzzleView;