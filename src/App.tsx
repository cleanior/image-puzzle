import { useState } from "react";
import ImageShowcase from "./ImageShowcase";
import Image, { ImageSpec } from "./Image"

function App() {
  const [targetImage, setTargetImage] = useState({} as ImageSpec);
  return (
    undefined === targetImage.src ?
      <ImageShowcase onImageSelect={setTargetImage} /> :
      <Image targetImage={targetImage} />
  );
}

export default App;
