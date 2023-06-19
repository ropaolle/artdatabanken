import { useState } from 'react';
import './App.css';
import Navigation from './components/Navigation.tsx';
import Footer from './components/Footer.tsx';
import UploadImage from './components/UploadImage.tsx';

function App() {
  const [openUploadDialog, setOpenUploadDialog] = useState(false);

  return (
    <>
      <Navigation show={() => setOpenUploadDialog(true)} />
      <main className="container">
        <h1>Artdatabanken 2023</h1>
        <UploadImage open={openUploadDialog} show={setOpenUploadDialog}/>
      </main>
      <Footer />
    </>
  );
}

export default App;
