import { useState } from 'react';
// import './App.css';
import { Navigation, ImageView, UploadImage, Footer } from './components';


function App() {
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  return (
    <>
      <Navigation show={() => setShowUploadDialog(true)} />
      <UploadImage open={showUploadDialog} show={setShowUploadDialog} />
      <main className="container">
        <h1>Sidgenerator</h1>
        <h2>Bilder</h2>
        {/* <ImageView /> */}
      </main>
      <Footer />
    </>
  );
}

export default App;
