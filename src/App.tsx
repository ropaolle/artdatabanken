import { useState } from 'react';
// import './App.css';
import { Navigation, ImageView, UploadImage, Footer } from './components';

function App() {
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  return (
    <>
      <Navigation show={() => setShowUploadDialog(true)} />
      <main className="container">
        <h1>Sidgenerator</h1>
        {/* <h2>Bilder</h2> */}
        <UploadImage open={showUploadDialog} show={setShowUploadDialog} />
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
