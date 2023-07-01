import { useState, useEffect, useRef } from 'react';
import { db, checkIfImageExistsInDB, uploadFile, normalizeFilename } from '../lib/firebase.ts';
import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useForm, SubmitHandler } from 'react-hook-form';
import ReactCrop, { type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useDebounceEffect, drawImageOnCanvas } from '../lib';
import { Icon } from '@iconify/react';
import Dialog, { type DialogProps } from './Dialog';

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

// export default function UploadImageDialog({ open, close }: Props) {
export default function UploadImageDialog({ id, open, show, children }: DialogProps) {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [imageExists, setImageExists] = useState<boolean>(false);
  // const [imageUploaded, setImageUploaded] = useState<boolean>(false);
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
    formState: { errors, isSubmitSuccessful, isSubmitting, isDirty, isLoading, isSubmitted, isValid, isValidating },
  } = useForm<Inputs>();

  // console.log(
  //   'errors, isSubmitSuccessful, isSubmitting, isDirty, isLoading, isSubmitted, isValid, isValidating',
  //   errors,
  //   isSubmitSuccessful,
  //   isSubmitting,
  //   isDirty,
  //   isLoading,
  //   isSubmitted,
  //   isValid,
  //   isValidating
  // );

  useEffect(() => {
    console.log(
      'reset',
      errors,
      isSubmitSuccessful,
      isSubmitting,
      isDirty,
      isLoading,
      isSubmitted,
      isValid,
      isValidating
    );
    // reset({ imageFile: undefined });
    reset(undefined, { keepIsSubmitted: true });
  }, [isSubmitSuccessful, reset]);

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
        completedCrop &&
        completedCrop.width > 0 &&
        completedCrop.height > 0 &&
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
    const thumbnail = `${name}_thumb.${ext}`;
    const thumbnailPath = `images/${thumbnail}`;

    try {
      const fileInfo = {
        filename,
        thumbnail,
        downloadURL: await uploadFile(previewCanvasRef.current, path),
        thumbnailURL: await uploadFile(thumbnailCanvasRef.current, thumbnailPath),
        updatedAt: serverTimestamp(),
      };
      if (imageExists) {
        await updateDoc(doc(db, 'images', filename), fileInfo);
      } else {
        await setDoc(doc(db, 'images', filename), { ...fileInfo, createdAt: serverTimestamp() });
      }
    } catch (error) {
      console.error(error);
    }
    // } finally {
    //   reset();
    // }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement> | undefined) => {
    // Clear state
    // reset();
    // setPreview(undefined);
    // setCompletedCrop(undefined);
    // Set selected file
    const file = e?.target.files?.[0];
    setSelectedFile(file);
    if (file) {
      setImageExists(await checkIfImageExistsInDB(file.name));
    }
  };

  return (
    <Dialog {...{ id, open, show, children }} onSubmit={handleSubmit(onSubmit)} title="Ladda upp bild">
      <p>Ladda upp en ny eller ersätt befintlig bild.</p>

      <input type="file" {...register('imageFile', { onChange: handleChange })} />

      {!isSubmitSuccessful && (
        <ReactCrop crop={crop} onChange={(c) => setCrop(c)} onComplete={(c) => setCompletedCrop(c)} aspect={1}>
          <img src={preview} ref={imgRef} />
        </ReactCrop>
      )}

      <div>
        <canvas className="image" ref={previewCanvasRef} hidden={!isSubmitSuccessful} />
        <canvas className="thumbnail" ref={thumbnailCanvasRef} hidden />
      </div>

      {/* {!isSubmitSuccessful && ()} */}
      <footer>
        {imageExists /* && !isSubmitSuccessful */ && (
          <div className="info">
            <Icon icon="material-symbols:info-outline" /> En bild med namnet <b>{selectedFile?.name}</b> existerar
            redan. Om du laddar upp en ny bild med samma namn skrivs den befintliga bilden över!
          </div>
        )}
        <button role="button" type="submit" disabled={!completedCrop || isSubmitSuccessful} aria-busy={isSubmitting}>
          Ladda upp
        </button>
      </footer>

      {isSubmitSuccessful && (
        <div className="info">
          Uppladdningen av <b>{selectedFile?.name}</b> lyckades.
        </div>
      )}
    </Dialog>
  );
}
