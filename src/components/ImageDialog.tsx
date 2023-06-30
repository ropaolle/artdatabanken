import { useState, useEffect, useRef } from 'react';
import { db, checkIfImageExistsInDB, /* canvasToBlob, */ uploadFile, normalizeFilename } from '../lib/firebase.ts';
import { doc, addDoc, setDoc, updateDoc, serverTimestamp, collection } from 'firebase/firestore';
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

async function drawImageOnCanvas({ image, canvas, crop, width, height }: CanvasProps) {
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
  close: () => void;
};

const defaultCropArea: PixelCrop = {
  unit: 'px',
  width: 250,
  height: 250,
  x: 250,
  y: 250,
};

export default function ImageDialog({ open, close }: Props) {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [imageExists, setImageExists] = useState<boolean>(false);
  const [imageUploaded, setImageUploaded] = useState<boolean>(false);
  const [progresspercent, setProgresspercent] = useState(0);
  const [crop, setCrop] = useState<PixelCrop>(defaultCropArea);
  const [preview, setPreview] = useState<string>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const thumbnailCanvasRef = useRef<HTMLCanvasElement>(null);

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
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current &&
        thumbnailCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        drawImageOnCanvas({
          image: imgRef.current,
          canvas: previewCanvasRef.current,
          crop: completedCrop,
          width: 500,
          height: 500,
        });
        drawImageOnCanvas({
          image: imgRef.current,
          canvas: thumbnailCanvasRef.current,
          crop: completedCrop,
          width: 100,
          height: 100,
        });
      }
    },
    100,
    [completedCrop]
  );

  const onSubmit: SubmitHandler<Inputs> = async ({ imageFile }) => {
    if (!previewCanvasRef.current || !thumbnailCanvasRef.current) {
      throw new Error('Crop canvas does not exist');
    }

    const filename = normalizeFilename(imageFile[0].name);
    const path = `images/${filename}`;

    const [name, ext] = filename.split('.');
    const thumbnail = `${name}_thumb.${ext}`
    const thumbnailPath = `images/${thumbnail}`;

    try {
      // Upload image
      const downloadURL = await uploadFile(previewCanvasRef.current, path, (progress: number) => {
        setProgresspercent(progress);
      });

      // // Upload thumb
      const thumbnailURL = await uploadFile(thumbnailCanvasRef.current, thumbnailPath, (progress: number) => {
        setProgresspercent(progress);
      });

      const fileInfo = {
        filename,
        thumbnail,
        downloadURL,
        thumbnailURL,
        updatedAt: serverTimestamp(),
      };

      if (imageExists) {
        await updateDoc(doc(db, 'images', filename), fileInfo);
      } else {
        // await addDoc(collection(db, 'images'), { ...fileInfo, createdAt: serverTimestamp() })
        await setDoc(doc(db, 'images', filename), { ...fileInfo, createdAt: serverTimestamp() });
      }
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
      console.log('file.name', file.name);
    }
  };

  const onClick = (e: React.FormEvent) => {
    e.preventDefault();
    close();
  };

  return (
    <dialog id="imageDialog" open={open}>
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

          <div>
            <canvas className="image" ref={previewCanvasRef} hidden={!imageUploaded} />
            <canvas className="thumbnail" ref={thumbnailCanvasRef} hidden />
          </div>

          {progresspercent > 0 && <progress value={progresspercent} max="100" />}

          {!imageUploaded && (
            <footer>
              {imageExists && !imageUploaded && (
                <div className="info">
                  <Icon icon="material-symbols:info-outline" /> En bild med namnet <b>{selectedFile?.name}</b>{' '}
                  existerar redan. Om du laddar upp en ny bild med samma namn skrivs den befintliga bilden över!
                </div>
              )}
              <button
                role="button"
                type="submit"
                disabled={!completedCrop || imageUploaded}
                aria-busy={progresspercent > 0}
              >
                Ladda upp
              </button>
            </footer>
          )}

          {imageUploaded && (
            <div className="info">
              Uppladdningen av <b>{selectedFile?.name}</b> lyckades.
            </div>
          )}
        </article>
      </form>
    </dialog>
  );
}
