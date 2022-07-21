import { BrowserRouter, Routes, Route } from "react-router-dom";
import ImageLoader from "./ImageLoader";
import Image from "./Image"

export const ROOT_URL: string = "/image-puzzle";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={`${ROOT_URL}`} element={<ImageLoader />} />
        <Route path={`${ROOT_URL}/image/:id`} element={<Image />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
