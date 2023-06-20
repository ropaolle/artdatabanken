import { useState } from 'react';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
// import './App.css';
import Navigation from './components/Navigation.tsx';
import Footer from './components/Footer.tsx';
import UploadImage from './components/UploadImage.tsx';
import ImageList from './components/ImageList.tsx';
import ImageView from './components/ImageView.tsx';

function App() {
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [crop, setCrop] = useState<Crop>();

  return (
    <>
      <Navigation show={() => setOpenUploadDialog(true)} images={() => setOpenImageDialog(true)} />
      <main className="container">
        <h1>Sidgenerator</h1>
        {/* <h2>Bilder</h2> */}
        <UploadImage open={openUploadDialog} show={setOpenUploadDialog} />
        <ImageList open={openImageDialog} show={setOpenImageDialog} />
        {/* <ImageView /> */}
        {/* <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
          <img src={'image516.jpg'} />
        </ReactCrop> */}
      </main>
      <Footer />
    </>
  );
}

export default App;
