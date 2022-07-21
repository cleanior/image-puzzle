import { ImageSpec } from "./Image";

interface Props {
    image: ImageSpec;
}

function NormalView({ image }: Props) {
    return (
        <div>
            {"undefined" !== typeof image.src ?
                <img src={image.src.large} alt={image.alt} /> :
                <h1> Loading ...</h1>
            }
        </div>
    );
}

export default NormalView;