import { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef } from "react";
import { ImageSpec } from "../Image";
import KeywordInput from "./KeywordInput";

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
    updateFunction: Dispatch<SetStateAction<Array<ImageSpec>>>) {

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

interface ProvidedImagesInputProps {
    updateImages: Dispatch<SetStateAction<ImageSpec[]>>;
};

function ProvidedImagesInput({ updateImages }: ProvidedImagesInputProps) {
    const keywordInput = useRef() as MutableRefObject<HTMLInputElement>;

    useEffect(() => {
        loadImagesFromPexels(undefined, updateImages);
    }, [updateImages]);

    return <form onSubmit={(event) => {
        event.preventDefault();
        const inputElement = keywordInput.current;
        console.log(inputElement.value);
        loadImagesFromPexels(inputElement.value, updateImages);
        inputElement.value = "";
    }}>
        <KeywordInput ref={keywordInput} />
        <button>Search</button>
    </form>;
}

export default ProvidedImagesInput;