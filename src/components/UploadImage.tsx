import { useState } from 'react';
import { storage, checkIfFileExists, listAllFiles } from '../firebase.ts';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

type Props = {
  open: boolean;
  show: React.Dispatch<React.SetStateAction<boolean>>;
};

interface FormElements extends HTMLFormControlsCollection {
  imageFiles: HTMLInputElement;
}

interface YourFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

export default function UploadImage({ open, show }: Props) {
  const [imgName, setImgName] = useState<null | string>(null);
  const [imgUrl, setImgUrl] = useState<null | string>(null);
  const [progresspercent, setProgresspercent] = useState(0);

  // listAllFiles('files');

  const handleSubmit = async (e: React.FormEvent<YourFormElement>) => {
    e.preventDefault();

    const file = e.currentTarget.elements.imageFiles?.files?.[0];
    if (!file) return;
    const path = `files/${file.name}`;

    // const exists = await checkIfFileExists(path);

    setImgUrl(null);

    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

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
        });
      }
    );
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
          <h3>Upload image</h3>

          <label htmlFor="file">
            Välj vilken bild som ska laddas upp.
            <input
              type="file"
              id="imageFiles"
              // multiple
              onChange={({ target }) => {
                setImgUrl(null);
                setProgresspercent(0);
                setImgName(target.files?.[0].name || null);
              }}
            />
          </label>

          <div className="center">
            <p>
              {!imgUrl && (
                <>
                  <progress value={progresspercent} max="100" />
                  {progresspercent}%
                </>
              )}
              {imgUrl && <img src={imgUrl} alt="uploaded file" width={400} />}
            </p>
          </div>

          <footer>
            <div className="grid">
              <button role="button" className="secondary" onClick={hide}>
                Close
              </button>
              <button role="button" type="submit" disabled={imgName === null}>
                Upload
              </button>
            </div>
          </footer>
        </article>
      </form>
    </dialog>
  );
}
