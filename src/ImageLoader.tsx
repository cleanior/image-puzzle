
import {
    Dispatch,
    MutableRefObject,
    SetStateAction,
    useEffect,
    useRef,
    useState
} from "react";
import { ImageSpec } from "./Image";
import styles from "./ImageLoader.module.css"

const API_KEY: string = "563492ad6f91700001000001d018c0886b834e648d173692bada7740";
const CURATED_PHOPTOS_URL: string = "https://api.pexels.com/v1/curated";
const SEARCH_PHOTOS_URL: string = "https://api.pexels.com/v1/search";
// const EXACT_IMAGE_URL: string = "https://api.pexels.com/v1/photos";
const IAMGES_PER_PAGE: number = 80;

type PexelsImageSpec = {
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
};

function makeUrlToSearch(keywordToSearch?: string) {
    if (undefined !== keywordToSearch) {
        if (0 !== keywordToSearch.trim().length) {
            return `${SEARCH_PHOTOS_URL}?query=${keywordToSearch}&per_page=${IAMGES_PER_PAGE}`;
        }
    }

    return `${CURATED_PHOPTOS_URL}?per_page=${IAMGES_PER_PAGE}`;
}

async function loadImagesFromPexels(
    keywordToSearch: string | undefined,
    updateFunction: React.Dispatch<React.SetStateAction<Array<ImageSpec>>>) {

    const urlToFetch = makeUrlToSearch(keywordToSearch);
    console.log(`load Images: ${urlToFetch}`);
    const response = await fetch(urlToFetch,
        {
            headers: {
                Authorization: API_KEY
            }
        });
    const json = await response.json();
    console.log(json);
    const images = Array<ImageSpec>();
    const pexelsImages = json.photos as Array<PexelsImageSpec>;
    pexelsImages.map((pexelsImage) => {
        images.push({ src: pexelsImage.src.large, alt: pexelsImage.alt });
        return pexelsImage;
    });

    updateFunction(() => (images));
}

interface ImageLoaderProps {
    onImageSelect: Dispatch<SetStateAction<ImageSpec>>;
}

function ImageLoader({ onImageSelect }: ImageLoaderProps) {

    const [images, setImages] = useState(Array<ImageSpec>());
    useEffect(() => {
        const keywordToSearch = undefined;
        loadImagesFromPexels(keywordToSearch, setImages);
    }, []);
    const keywordInput = useRef() as MutableRefObject<HTMLInputElement>;

    return (
        <div>
            <form onSubmit={(event) => {
                event.preventDefault();
                const inputElement = keywordInput.current;
                console.log(inputElement.value);
                loadImagesFromPexels(inputElement.value, setImages);
                inputElement.value = "";
            }}>
                <input required placeholder="Write to search ..." ref={keywordInput} />
                <button>Search</button>
                <input type={"file"} accept="image/*" multiple={true} onChange={(event) => {
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

                    setImages((prevImages) => {
                        prevImages.map((prevImage) => {
                            URL.revokeObjectURL(prevImage.src);
                            console.log("revoke!!!");
                            return null;
                        });

                        return 0 < images.length ? images : prevImages;
                    });
                }} />
            </form>
            <ul className={styles.ul}>
                {images.map((image) => (
                    <img className={styles.listImage}
                        key={image.src}
                        src={image.src}
                        alt={image.alt}
                        onClick={() => {
                            onImageSelect(() => (image));
                        }}
                    />
                ))}
            </ul>
        </div >
    );
}

export default ImageLoader;