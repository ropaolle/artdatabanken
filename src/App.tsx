import { useState } from 'react';
// import './App.css';
import { Navigation, ImageView, AddSpeciesDialog, UploadImageDialog, Footer, Dialogs } from './components';

function App() {
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showAddSpeciesDialog, setShowAddSpeciesDialog] = useState(false);

  const showDialog = (dialog: number, show = true) => {
    switch (dialog) {
      case Dialogs.UPLOAD_IMAGE_DIALOG:
        setShowUploadDialog(show);
        break;
      case Dialogs.ADD_SPECIES_DIALOG:
        setShowAddSpeciesDialog(show);
        break;
    }
  };

  return (
    <>
      <Navigation show={showDialog} />
      {/* <UploadImageDialog open={showUploadDialog} hide={() => showDialog(Dialogs.UPLOAD_IMAGE_DIALOG, false)} />
      <AddSpeciesDialog open={showAddSpeciesDialog} hide={() => showDialog(Dialogs.ADD_SPECIES_DIALOG, false)} /> */}

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
