import ReactCrop, { type Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useState, useEffect, useRef } from 'react';
import { storage, db } from '../lib/firebase.ts';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { canvasPreview } from './canvasPreview';
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

export default function UploadImage({ open, show }: Props) {
  const [imgName, setImgName] = useState<null | string>(null);
  const [imgUrl, setImgUrl] = useState<null | string>(null);
  const [imgExists, setImgExists] = useState<boolean>(false);
  const [progresspercent, setProgresspercent] = useState(0);
  const [crop, setCrop] = useState<Crop>();
  // const [orgImg, setOrgImg] = useState('');
  const [selectedFile, setSelectedFile] = useState<File>();
  const [preview, setPreview] = useState<string>();
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const blobUrlRef = useRef('');
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);

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
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop
          // scale,
          // rotate,
        );
      }
    },
    100,
    [completedCrop /* , scale, rotate */]
  );

  const handleSubmit = async (e: React.FormEvent<CustomFormElement>) => {
    e.preventDefault();

    const file = e.currentTarget.elements.imageFiles?.files?.[0];
    if (!file) return;
    const path = `files/${file.name}`;

    setImgUrl(null);

    if (!previewCanvasRef.current) {
      throw new Error('Crop canvas does not exist');
    }

    previewCanvasRef.current.toBlob((blob) => {
      if (!blob) {
        throw new Error('Failed to create blob');
      }
      // if (blobUrlRef.current) {
      //   URL.revokeObjectURL(blobUrlRef.current);
      // }
      // blobUrlRef.current = URL.createObjectURL(blob);
      // console.log('blobUrlRef.current', blobUrlRef.current);
      // hiddenAnchorRef.current!.href = blobUrlRef.current
      // hiddenAnchorRef.current!.click()

      // OLD CODE
      const storageRef = ref(storage, path);
      // const uploadTask = uploadBytesResumable(storageRef, file);
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
            setImgUrl(downloadURL);
            setImgName(null);
            setDoc(doc(db, 'images', file.name), {
              filename: file.name,
              downloadURL,
              updatedAt: serverTimestamp(),
              // timestamp: Timestamp,
            }).catch((error) => console.log(error));
          });
        }
      );
    });
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement> | undefined) => {
    // Clear form
    setImgUrl(null);
    setProgresspercent(0);

    // Preview
    if (!e?.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
    } else {
      setSelectedFile(e.target.files[0]);
    }

    // Update
    // console.log('e?.target.files?.[0]', e?.target.files?.[0]);
    // console.log('imgName', imgName);
    const name = e?.target.files?.[0]?.name;
    setImgName(name || null);
    if (name) {
      const docRef = doc(db, 'images', name);
      const docSnap = await getDoc(docRef);
      setImgExists(docSnap.exists());
      // if (docSnap.exists()) {
      //   console.log('Document data:', docSnap.data());
      // }
    }
  };

  const hide = (e: React.FormEvent) => {
    e.preventDefault();
    show(false);
  };

  return (
    <dialog id="modal-example" open={open}>
      <form onSubmit={handleSubmit} className="form">
        <article>
          <a href="#" aria-label="Close" className="close" onClick={hide}></a>
          <h3>Ladda upp bild</h3>
          <p>Ladda upp en ny eller ersätt befintlig bild.</p>
          <p>
            <input type="file" id="imageFiles" onChange={handleChange} />
          </p>

          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1}
            minWidth={250}
            minHeight={250}
          >
            <img src={preview} ref={imgRef} />
          </ReactCrop>

          {!!completedCrop && (
            <div>
              <canvas hidden
                ref={previewCanvasRef}
                style={{
                  border: '1px solid black',
                  objectFit: 'contain',
                  width: completedCrop?.width,
                  height: completedCrop?.height,
                }}
              />
            </div>
          )}

          <div className="center">
            {!imgUrl && progresspercent > 0 && (
              <>
                <progress value={progresspercent} max="100" />
                {/* {progresspercent}% */}
              </>
            )}
            {/* {imgUrl && <img src={imgUrl} alt="uploaded file" width={400} />} */}
          </div>

          <footer>
            {imgExists && (
              <div className="info">
                Bilden existerar redan. Om du laddar upp en ny bild med samma namn skrivs den befintliga över.
              </div>
            )}
            <div className="grid">
              <div></div>
              <button role="button" className="secondary" onClick={hide}>
                Stäng
              </button>
              <button role="button" onClick={hide}>
                Beskär
              </button>
              <button role="button" type="submit" disabled={imgName === null}>
                Ladda upp
              </button>
            </div>
          </footer>
        </article>
      </form>
    </dialog>
  );
}
