import { Dispatch, SetStateAction, useState } from "react";
import ImageLoader from "./ImageLoader";
import Image from "./Image"

function App() {
  const [imageId, setImageId] = useState<string>();
  return (
    undefined === imageId ?
      <ImageLoader onImageSelect={setImageId as Dispatch<SetStateAction<string>>} /> :
      <Image id={imageId} />
  );
}

export default App;
