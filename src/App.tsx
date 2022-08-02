import { Dispatch, SetStateAction, useState } from "react";
import ImageLoader from "./ImageLoader";
import Image, { ImageSpec } from "./Image"

function App() {
  const [targetImage, setTargetImage] = useState({} as ImageSpec);
  return (
    undefined === targetImage.src ?
      <ImageLoader onImageSelect={setTargetImage as Dispatch<SetStateAction<ImageSpec>>} /> :
      <Image targetImage={targetImage} />
  );
}

export default App;
