import { Dispatch, SetStateAction } from "react";
import { ImageSpec } from "../Image";
import styles from "./ImageList.module.css"

interface ImageListProps {
    images: Array<ImageSpec>;
    onImageSelect: Dispatch<SetStateAction<ImageSpec>>;
}

function ImageList(props: ImageListProps) {
    return <ul className={styles.ul}>
        {props.images.map((image) => (
            <img className={styles.listImage}
                key={image.src}
                src={image.src}
                alt={image.alt}
                onClick={() => {
                    props.onImageSelect(() => (image));
                }}
            />
        ))}
    </ul>;
}

export default ImageList;