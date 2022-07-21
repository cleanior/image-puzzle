import { BrowserRouter, Routes, Route } from "react-router-dom";
import ImageLoader from "./ImageLoader";
import Image from "./Image"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ImageLoader />} />
        <Route path="/image/:id" element={<Image />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
