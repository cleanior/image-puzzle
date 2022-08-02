
import {
    Dispatch,
    MutableRefObject,
    SetStateAction,
    useEffect,
    useRef,
    useState
} from "react";
import { ImageSpec } from "./Image";

const API_KEY: string = "563492ad6f91700001000001d018c0886b834e648d173692bada7740";
const CURATED_PHOPTOS_URL: string = "https://api.pexels.com/v1/curated";
const SEARCH_PHOTOS_URL: string = "https://api.pexels.com/v1/search";
const EXACT_IMAGE_URL: string = "https://api.pexels.com/v1/photos";
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

function makeUrlToSearch(
    keywordToSearch?: string,
    id?: string) {
    if (undefined !== id) {
        return `${EXACT_IMAGE_URL}/${id}`;
    }

    if (undefined !== keywordToSearch) {
        if (0 !== keywordToSearch.trim().length) {
            return `${SEARCH_PHOTOS_URL}?query=${keywordToSearch}&per_page=${IAMGES_PER_PAGE}`;
        }
    }

    return `${CURATED_PHOPTOS_URL}?per_page=${IAMGES_PER_PAGE}`;
}

export async function loadImages<T>(
    keywordToSearch: string | undefined,
    updateFunction: React.Dispatch<React.SetStateAction<T>>) {

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
    updateFunction(json.photos);
}

export async function loadImage<T>(
    id: string,
    updateFunction: React.Dispatch<React.SetStateAction<T>>) {

    const urlToFetch = makeUrlToSearch(undefined, id.toString());
    console.log(`load Image: ${urlToFetch}`);
    const response = await fetch(urlToFetch,
        {
            headers: {
                Authorization: API_KEY
            }
        });
    const json = await response.json();
    console.log(json);
    updateFunction(json);
}

interface ImageLoaderProps {
    onImageSelect: Dispatch<SetStateAction<ImageSpec>>;
}

function ImageLoader({ onImageSelect }: ImageLoaderProps) {

    const [images, setImages] = useState<PexelsImageSpec[]>([]);
    useEffect(() => {
        const keywordToSearch = undefined;
        loadImages(keywordToSearch, setImages);
    }, []);
    const keywordInput = useRef() as MutableRefObject<HTMLInputElement>;

    return (
        <div>
            <form onSubmit={(event) => {
                event.preventDefault();
                const inputElement = keywordInput.current;
                console.log(inputElement.value);
                loadImages(inputElement.value, setImages);
                inputElement.value = "";
            }}>
                <input required placeholder="Write to search ..." ref={keywordInput} />
                <button>Search</button>
            </form>
            <ul>
                {images.map((image) => (
                    <img
                        key={image.id}
                        src={image.src.medium}
                        alt={image.alt}
                        onClick={() => {
                            onImageSelect(() => ({ src: image.src.large, alt: image.alt }));
                        }}
                    />
                ))}
            </ul>
        </div >
    );
}

export default ImageLoader;