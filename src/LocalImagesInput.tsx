import { Dispatch, SetStateAction } from "react";
import { ImageSpec } from "./Image";

interface LocalImagesInputProps {
    updateImages: Dispatch<SetStateAction<ImageSpec[]>>;
};

function LocalImagesInput({ updateImages }: LocalImagesInputProps) {
    return <input type={"file"} accept="image/*" multiple={true} onChange={(event) => {
        const files = event.target.files as FileList;
        console.log(files);
        const images = Array<ImageSpec>();
        for (let index = 0; index < files.length; index++) {
            const image = {
                src: URL.createObjectURL(files[index]),
                alt: files[index].name
            };

            images.push(image);
        }

        updateImages((prevImages) => {
            prevImages.map((prevImage) => {
                URL.revokeObjectURL(prevImage.src);
                console.log("revoke!!!");
                return null;
            });

            return 0 < images.length ? images : prevImages;
        });
    }} />;
}

export default LocalImagesInput;