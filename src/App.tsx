import { useState } from 'react';
// import './App.css';
import { Navigation, ImageView, AddSpecies, UploadImage, Footer } from './components';

function App() {
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showAddSpeciesDialog, setShowAddSpeciesDialog] = useState(false);

  const showDialog = (dialog: string/* , show: boolean */) => {
    switch (dialog) {
      case 'uploadDialog':
        setShowUploadDialog(true);
        break;
      case 'addSpeciesDialog':
        setShowAddSpeciesDialog(true);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Navigation show={showDialog} />
      <UploadImage open={showUploadDialog} show={setShowUploadDialog} />
      <AddSpecies open={showAddSpeciesDialog} show={setShowAddSpeciesDialog} />
      <main className="container">
        <h2 id="speices">Arter</h2>
        <h2 id="images">Bilder</h2>
        <ImageView />
      </main>
      <Footer />
    </>
  );
}

export default App;
