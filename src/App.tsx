import { useState, useEffect } from 'react';
// import './App.css';
import { Navigation, ImageView, AddSpeciesDialog, UploadImageDialog, Footer, Dialogs } from './components';
import { getImageInfo } from './lib/firebase.ts';
import { DocumentData } from 'firebase/firestore';

const dummyImageData: DocumentData[] = [
  {
    filename: 'image01.jpg',
    downloadURL: './?/image01.jpg',
    updatedAt: {
      toDate: () => new Date(),
    },
  },
  {
    filename: 'image02.jpg',
    downloadURL: './?/image02.jpg',
    updatedAt: {
      toDate: () => new Date(),
    },
  },
];

function App() {
  const [images, setImages] = useState<DocumentData[]>(dummyImageData);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showAddSpeciesDialog, setShowAddSpeciesDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      console.log('fetch data');
      const data = await getImageInfo();
      console.log('data', data);
      setImages(data);
    };

    fetchData().catch(console.error);
  }, [images]);

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
        <ImageView images={images} />
      </main>
      <Footer />
    </>
  );
}

export default App;
