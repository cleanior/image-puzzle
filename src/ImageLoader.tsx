
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ROOT_URL } from "./App";
import { ImageSpec } from "./Image";

const API_KEY: string = "563492ad6f91700001000001d018c0886b834e648d173692bada7740";
const CURATED_PHOPTOS_URL: string = "https://api.pexels.com/v1/curated";
const SEARCH_PHOTOS_URL: string = "https://api.pexels.com/v1/search";
const EXACT_IMAGE_URL: string = "https://api.pexels.com/v1/photos";
const IAMGES_PER_PAGE: number = 80;

function makeUrlToSearch(
    keywordToSearch?: string,
    id?: string) {
    if ("undefined" !== typeof id) {
        return `${EXACT_IMAGE_URL}/${id}`;
    }

    if ("undefined" !== typeof keywordToSearch) {
        if (0 !== keywordToSearch.trim().length) {
            return `${SEARCH_PHOTOS_URL}?query=${keywordToSearch}&orientation=square&per_page=${IAMGES_PER_PAGE}`;
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

function ImageLoader(): JSX.Element {

    const [images, setImages] = useState<ImageSpec[]>([]);
    useEffect(() => {
        const keywordToSearch = undefined;
        loadImages(keywordToSearch, setImages);
    }, []);

    return (
        <div>
            <form onSubmit={(event) => {
                event.preventDefault();
                const inputElement = document.querySelector(".inputKeyword") as HTMLInputElement;
                console.log(inputElement.value);
                loadImages(inputElement.value, setImages);
                inputElement.value = "";
            }}>
                <input required className="inputKeyword" placeholder="Write to search ..." />
                <button>Search</button>
            </form>
            <ul>
                {images.map((image) => (
                    <Link key={image.id} to={`${ROOT_URL}/image/${image.id}`}>
                        <img src={image.src.medium} alt={image.alt} />
                    </Link>
                ))}
            </ul>
        </div >
    );
}

export default ImageLoader;