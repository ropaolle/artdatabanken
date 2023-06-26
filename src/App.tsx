import { useState, useEffect } from 'react';
// import './App.css';
import { Navigation, ImageView, AddSpeciesDialog, UploadImageDialog, Footer, Dialogs } from './components';
import { getImageInfo, ImageInfo } from './lib/firebase.ts';
import { Timestamp } from 'firebase/firestore';

const dummyImageData: ImageInfo[] = [
  {
    filename: 'image01.jpg',
    downloadURL: './?/image01.jpg',
    updatedAt: new Timestamp(0, 0),
  },
  {
    filename: 'image02.jpg',
    downloadURL: './?/image02.jpg',
    updatedAt: new Timestamp(0, 0),
  },
];

function App() {
  const [images, setImages] = useState<ImageInfo[]>(dummyImageData);
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
      <UploadImageDialog open={showUploadDialog} hide={() => showDialog(Dialogs.UPLOAD_IMAGE_DIALOG, false)} />
      <AddSpeciesDialog
        imageFilenames={images.map(({ filename }) => filename)}
        open={showAddSpeciesDialog}
        hide={() => showDialog(Dialogs.ADD_SPECIES_DIALOG, false)}
      />

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
