import { useState } from "react";
import ImageShowcase from "./showcase/ImageShowcase";
import SelectedImage, { ImageSpec } from "./SelectedImage"

const App = () => {
  const [targetImage, setTargetImage] = useState({} as ImageSpec);
  return (
    undefined === targetImage.src ?
      <ImageShowcase onImageSelect={setTargetImage} /> :
      <SelectedImage targetImage={targetImage} />
  );
}

export default App;
