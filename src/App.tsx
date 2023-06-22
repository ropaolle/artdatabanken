import { useState } from 'react';
// import './App.css';
import { Navigation, ImageView, SpeicesView, UploadImage, Footer } from './components';

function App() {
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  return (
    <>
      <Navigation show={() => setShowUploadDialog(true)} />
      <UploadImage open={showUploadDialog} show={setShowUploadDialog} />
      <main className="container">
        <h2 id="speices">Arter</h2>
        <SpeicesView />
        <h2 id="images">Bilder</h2>
        <ImageView />
      </main>
      <Footer />
    </>
  );
}

export default App;
