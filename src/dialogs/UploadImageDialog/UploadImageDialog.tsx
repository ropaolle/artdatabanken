import 'react-image-crop/dist/ReactCrop.css';
import { useState, useEffect, useRef } from 'react';
import { doc, setDoc, Timestamp } from 'firebase/firestore/lite';
import { useForm, SubmitHandler } from 'react-hook-form';
import ReactCrop, { type PixelCrop } from 'react-image-crop';
import { Icon } from '@iconify/react';
import { checkIfImageExists, normalizeFilename, uploadFile, db, COLLECTIONS, PATHS } from '../../lib/firebase';
import useDebounceEffect from './useDebounceEffect';
import drawImageOnCanvas from './drawImageOnCanvas';
import Dialog, { DialogInfo } from '../Dialog';
import { useAppStore } from '../../state';

type Inputs = {
  imageFile: FileList;
};

const defaultCropArea: PixelCrop = {
  unit: 'px',
  width: 250,
  height: 250,
  x: 250,
  y: 250,
};

type Props = {
  open: boolean;
  show: React.Dispatch<boolean>;
};

export default function UploadImageDialog({ open, show }: Props) {
  const { addOrUpdateImage, user } = useAppStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageExists, setImageExists] = useState<boolean>(false);
  const [crop, setCrop] = useState<PixelCrop>(defaultCropArea);
  const [preview, setPreview] = useState<string>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const thumbnailCanvasRef = useRef<HTMLCanvasElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful, isSubmitting },
  } = useForm<Inputs>();

  useEffect(() => {
    setSelectedFile(null);
    reset();
    show(false);
  }, [isSubmitSuccessful, reset, show]);

  useEffect(() => {
    if (!selectedFile) {
      setCompletedCrop(undefined);
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    const imageExists = async () => {
      setImageExists(selectedFile ? await checkIfImageExists(selectedFile?.name) : false);
    };

    imageExists();
  }, [selectedFile]);

  useDebounceEffect(
    async () => {
      if (
        completedCrop &&
        completedCrop.width > 0 &&
        completedCrop.height > 0 &&
        imgRef.current &&
        previewCanvasRef.current &&
        thumbnailCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        drawImageOnCanvas(imgRef.current, previewCanvasRef.current, completedCrop, 500, 500);
        drawImageOnCanvas(imgRef.current, thumbnailCanvasRef.current, completedCrop, 100, 100);
      }
    },
    100,
    [completedCrop]
  );

  const onSubmit: SubmitHandler<Inputs> = async ({ imageFile }) => {
    if (!user) return;

    if (!previewCanvasRef.current || !thumbnailCanvasRef.current) {
      throw new Error('Crop canvas does not exist');
    }

    const filename = normalizeFilename(imageFile[0].name);
    const path = `${PATHS.IMAGES}/${filename}`;
    const thumbnailPath = `${PATHS.THUMBNAILS}/${filename}`;
    const id = filename;

    try {
      const image: ImageInfo = {
        id,
        filename,
        URL: await uploadFile(previewCanvasRef.current, path),
        thumbnailURL: await uploadFile(thumbnailCanvasRef.current, thumbnailPath),
        updatedAt: Timestamp.now(),
      };

      if (!imageExists) {
        image.createdAt = Timestamp.now();
        await setDoc(doc(db, COLLECTIONS.IMAGES, id), image);
      } else {
        await setDoc(doc(db, COLLECTIONS.IMAGES, id), image, { merge: true });
      }

      addOrUpdateImage(image);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = async (e?: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target.files?.[0];
    setSelectedFile(file || null);
  };

  const hide = () => show(false);

  return (
    <Dialog
      id="upload-image-dialog-fix"
      open={open}
      hide={hide}
      onSubmit={handleSubmit(onSubmit)}
      title={'Ladda upp bild'}
    >
      <p>Ladda upp en ny eller ersätt befintlig bild.</p>

      <input type="file" {...register('imageFile', { required: 'This field is required!', onChange: handleChange })} />

      <ReactCrop crop={crop} onChange={(c) => setCrop(c)} onComplete={(c) => setCompletedCrop(c)} aspect={1}>
        <img src={preview} ref={imgRef} />
      </ReactCrop>

      <div>
        <canvas className="image" ref={previewCanvasRef} hidden={!isSubmitSuccessful} />
        <canvas className="thumbnail" ref={thumbnailCanvasRef} hidden />
      </div>

      <footer>
        {imageExists && (
          <DialogInfo>
            <Icon inline icon="material-symbols:info-outline" /> En bild med namnet <b>{selectedFile?.name}</b>{' '}
            existerar redan. Om du laddar upp en ny bild med samma namn skrivs den befintliga bilden över!
          </DialogInfo>
        )}

        <button
          role="button"
          type="submit"
          disabled={!completedCrop || completedCrop.width === 0 || completedCrop.height === 0}
          aria-busy={isSubmitting}
        >
          Ladda upp
        </button>
      </footer>
    </Dialog>
  );
}
