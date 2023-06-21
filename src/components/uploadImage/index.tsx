import { useState, useEffect, useRef } from 'react';
import { storage, db, checkIfImageExists } from '../../lib/firebase.ts';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

import ReactCrop, { type Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { canvasPreview } from './canvasPreviewFixed';
import { useDebounceEffect } from './useDebounceEffect';

type Props = {
  open: boolean;
  show: React.Dispatch<React.SetStateAction<boolean>>;
};

interface FormElements extends HTMLFormControlsCollection {
  imageFiles: HTMLInputElement;
}

interface CustomFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

const defaultCropArea: Crop = {
  unit: 'px',
  width: 250,
  height: 250,
  x: 250,
  y: 250,
};

export default function UploadImage({ open, show }: Props) {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [imageExists, setImageExists] = useState<boolean>(false);
  const [imageUploaded, setImageUploaded] = useState<boolean>(false);
  const [progresspercent, setProgresspercent] = useState(0);
  const [crop, setCrop] = useState<Crop>(defaultCropArea);
  const [preview, setPreview] = useState<string>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  useDebounceEffect(
    async () => {
      if (completedCrop?.width && completedCrop?.height && imgRef.current && previewCanvasRef.current) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
      }
    },
    100,
    [completedCrop]
  );

  const handleSubmit = async (e: React.FormEvent<CustomFormElement>) => {
    e.preventDefault();

    const filename = e.currentTarget.elements.imageFiles?.files?.[0]?.name;
    if (!filename) return;

    if (!previewCanvasRef.current) {
      throw new Error('Crop canvas does not exist');
    }

    previewCanvasRef.current.toBlob((blob) => {
      if (!blob) {
        throw new Error('Failed to create blob');
      }

      const path = `images/${filename}`;
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgresspercent(progress);
        },
        (error) => {
          alert(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setDoc(doc(db, 'images', filename), {
              filename,
              downloadURL,
              updatedAt: serverTimestamp(),
            }).catch((error) => console.log(error));
            setImageUploaded(true);
            setProgresspercent(0);
          });
        }
      );
    }, 'image/jpeg');
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement> | undefined) => {
    // Clear form
    setProgresspercent(0);
    setImageUploaded(false);
    setImageExists(false);

    // File selected
    const file = e?.target.files?.[0];
    if (!file) {
      setSelectedFile(undefined);
      return;
    }
    setSelectedFile(file);

    // File exists in Firebase DB
    const filename = e?.target.files?.[0]?.name || '';
    const imageExists = await checkIfImageExists(filename);
    setImageExists(imageExists);
  };

  const hide = (e: React.FormEvent) => {
    e.preventDefault();
    show(false);
  };

  const doSetCrop = (c) => {
    // console.log('c', c);
    setCrop(c);
  };

  return (
    <dialog id="dude" open={open}>
      <form onSubmit={handleSubmit} className="form">
        <article>
          <a href="#" aria-label="Close" className="close" onClick={hide}></a>
          <h3>Ladda upp bild</h3>
          <p>Ladda upp en ny eller ersätt befintlig bild.</p>

          <div>
            <input type="file" id="imageFiles" onChange={handleChange} />
          </div>

          {!imageUploaded && (
            <ReactCrop crop={crop} onChange={(c) => doSetCrop(c)} onComplete={(c) => setCompletedCrop(c)} aspect={1}>
              <img src={preview} ref={imgRef} />
            </ReactCrop>
          )}

          {/* <div className="preview-canvas-wrapper"> */}
          <canvas ref={previewCanvasRef} hidden={!imageUploaded} />
          {/* </div> */}

          {progresspercent > 0 && <progress value={progresspercent} max="100" />}

          <footer>
            {imageExists && !imageUploaded && (
              <div className="info">
                Bilden existerar. Om du laddar upp en ny bild med samma namn skrivs den befintliga bilden över!
              </div>
            )}
            <div className="grid">
              <button role="button" className="secondary" onClick={hide}>
                Stäng
              </button>
              <button role="button">Beskär</button>
              <button role="button" type="submit" disabled={imageUploaded}>
                Ladda upp
              </button>
            </div>
          </footer>
        </article>
      </form>
    </dialog>
  );
}
