import {
    Dispatch,
    SetStateAction,
    useState
} from "react";
import { ImageSpec } from "../SelectedImage";
import ImageList from "./ImageList";
import LocalImagesInput from "./LocalImagesInput";
import ProvidedImagesInput from "./ProvidedImagesInput";

interface ImageShowcaseProps {
    onImageSelect: Dispatch<SetStateAction<ImageSpec>>;
}

function ImageShowcase({ onImageSelect }: ImageShowcaseProps) {
    const [images, setImages] = useState(Array<ImageSpec>());
    return (
        <div>
            <ProvidedImagesInput updateImages={setImages} />
            <LocalImagesInput updateImages={setImages} />
            <ImageList images={images} onImageSelect={onImageSelect} />
        </div >
    );
}

export default ImageShowcase;