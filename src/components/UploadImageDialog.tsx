import { useState, useEffect, useRef } from 'react';
import { db, checkIfImageExistsInDB, canvasToBlob, uploadFile } from '../lib/firebase.ts';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useForm, SubmitHandler } from 'react-hook-form';
import ReactCrop, { type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useDebounceEffect } from '../lib/useDebounceEffect';
import { Icon } from '@iconify/react';

type CanvasProps = {
  image: HTMLImageElement;
  canvas: HTMLCanvasElement;
  crop: PixelCrop;
  width: number;
  height: number;
};

async function drawCanvasPreview({ image, canvas, crop, width, height }: CanvasProps) {
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  canvas.width = width;
  canvas.height = height;
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  ctx.save();
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleX,
    0,
    0,
    width,
    height
  );
  ctx.restore();
}

type Inputs = {
  imageFile: FileList;
};

type Props = {
  open: boolean;
  hide: () => void;
  // hide: (dialog: string, show?: boolean) => void;
  // show: React.Dispatch<React.SetStateAction<boolean>>;
};

const defaultCropArea: PixelCrop = {
  unit: 'px',
  width: 250,
  height: 250,
  x: 250,
  y: 250,
};

export default function UploadImageDialog({ open, hide }: Props) {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [imageExists, setImageExists] = useState<boolean>(false);
  const [imageUploaded, setImageUploaded] = useState<boolean>(false);
  const [progresspercent, setProgresspercent] = useState(0);
  const [crop, setCrop] = useState<PixelCrop>(defaultCropArea);
  const [preview, setPreview] = useState<string>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const { register, handleSubmit } = useForm<Inputs>();

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

  const onSubmit: SubmitHandler<Inputs> = async ({ imageFile }) => {
    if (!previewCanvasRef.current) {
      throw new Error('Crop canvas does not exist');
    }

    const filename = imageFile[0].name;
    const path = `images/${filename}`;

    try {
      const blob = await canvasToBlob(previewCanvasRef.current);
      const downloadURL = await uploadFile(blob, path, (progress: number) => {
        setProgresspercent(progress);
      });

      const fileInfo = {
        filename,
        downloadURL,
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'images', filename), fileInfo);
    } catch (error) {
      console.error(error);
    }

    setImageUploaded(true);
    setProgresspercent(0);
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement> | undefined) => {
    // Clear state
    setImageUploaded(false);
    setProgresspercent(0);
    setPreview(undefined);
    setCompletedCrop(undefined);
    // Set selected file
    const file = e?.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImageExists(await checkIfImageExistsInDB(file.name));
    }
  };

  const onClick = (e: React.FormEvent) => {
    e.preventDefault();
    hide();
    // show(dialogId, false);
  };

  return (
    <dialog id="uploadImageDialog" open={open}>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <article>
          <a href="#" aria-label="Close" className="close" onClick={onClick}></a>

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
            {imageExists && !imageUploaded && (
              <div className="info">
                <Icon icon="material-symbols:info-outline" /> En bild med namnet <b>{selectedFile?.name}</b> existerar.
                Om du laddar upp en ny bild med samma namn skrivs den befintliga bilden över!
              </div>
            )}
            <button role="button" type="submit" disabled={!completedCrop} aria-busy={progresspercent > 0}>
              Ladda upp
            </button>
          </footer>
        </article>
      </form>
    </dialog>
  );
}
