import { useState, useEffect, useRef } from 'react';
import { storage, db } from '../../lib/firebase.ts';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useForm, SubmitHandler, useWatch } from 'react-hook-form';
import ReactCrop, { type Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { drawCanvasPreview } from './drawCanvasPreview';
import { useDebounceEffect } from '../../lib//useDebounceEffect';

type Inputs = {
  imageFile: FileList;
};

type Props = {
  open: boolean;
  show: React.Dispatch<React.SetStateAction<boolean>>;
};

const defaultCropArea: Crop = {
  unit: 'px',
  width: 250,
  height: 250,
  x: 250,
  y: 250,
};

export default function UploadImage({ open, show }: Props) {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [imageUploaded, setImageUploaded] = useState<boolean>(false);
  const [progresspercent, setProgresspercent] = useState(0);
  const [crop, setCrop] = useState<Crop>(defaultCropArea);
  const [preview, setPreview] = useState<string>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const {
    register,
    handleSubmit,
    // watch,
    // formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = ({ imageFile }) => {
    console.log(imageFile);
    const filename = imageFile[0].name;
    // if (!filename) return;

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
        drawCanvasPreview({
          image: imgRef.current,
          canvas: previewCanvasRef.current,
          crop: completedCrop,
          width: 500,
          height: 500,
        });
      }
    },
    100,
    [completedCrop]
  );

  /* const handleSubmit = async (e: React.FormEvent<CustomFormElement>) => {
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
  }; */

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement> | undefined) => {
    // Clear state
    setImageUploaded(false);
    setProgresspercent(0);
    setPreview(undefined);
    setCompletedCrop(undefined);
    // Set selected file
    const file = e?.target.files?.[0];
    setSelectedFile(file);
  };

  const hide = (e: React.FormEvent) => {
    e.preventDefault();
    show(false);
  };

  return (
    <dialog id="dude" open={open}>
      {/* <form onSubmit={handleSubmit} className="form"> */}
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <article>
          <a href="#" aria-label="Close" className="close" onClick={hide}></a>

          <h3>Ladda upp bild</h3>
          <p>Ladda upp en ny eller ersätt befintlig bild.</p>

          <input type="file" {...register('imageFile', { onChange: handleChange })} />

          {!imageUploaded && (
            <ReactCrop crop={crop} onChange={(c) => setCrop(c)} onComplete={(c) => setCompletedCrop(c)} aspect={1}>
              <img src={preview} ref={imgRef} />
            </ReactCrop>
          )}

          <canvas ref={previewCanvasRef} hidden={!imageUploaded} />

          {progresspercent > 0 && <progress value={progresspercent} max="100" />}

          <footer>
            <button role="button" type="submit" disabled={!selectedFile || !!imageUploaded} /* aria-busy="true" */>
              Ladda upp
            </button>
          </footer>
        </article>
      </form>
    </dialog>
  );
}

/*
const [imageExists, setImageExists] = useState<boolean>(false);

 // File exists in Firebase DB
    const filename = e?.target.files?.[0]?.name || '';
    const imageExists = await checkIfImageExists(filename);
    setImageExists(imageExists);

{imageExists && !imageUploaded && (
  <div className="info">
    Bilden existerar. Om du laddar upp en ny bild med samma namn skrivs den befintliga bilden över!
  </div>
)}

*/
