import { useState } from 'react';
import { storage } from '../firebase.ts';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

type Props = {
  open: boolean;

  show: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function UploadImage({ open, show }: Props) {
  const [imgUrl, setImgUrl] = useState<null | string>(null);
  const [progresspercent, setProgresspercent] = useState(0);

  const handleSubmit = (e: any) => {
    console.log('e', { ...e });
    console.log('e', e.target);
    console.log('e', e.currentTarget);
    e.preventDefault();

    const file = e.target[0]?.files[0];
    if (!file) return;

    const storageRef = ref(storage, `files/${file.name}`);
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
        });
      }
    );
  };

  const hide = (e) => {
    e.preventDefault();
    show(false);
  };

  return (
    <dialog id="modal-example" open={open}>
      <form onSubmit={handleSubmit} className="form">
        <article>
          <a href="#" aria-label="Close" className="close" onClick={hide}></a>
          <h3>Upload image</h3>
          <p>Välj bild som ska laddas upp.</p>

          <p>
            <div className="grid">
              <input type="file" />
              <button role="button" type="submit">
                Upload
              </button>
            </div>
              <progress value={progresspercent} max="100" />
          </p>
          <p>{imgUrl && <img src={imgUrl} alt="uploaded file" height={200} />}</p>

          <footer>
            <div className="grid">
              <button role="button" className="secondary" onClick={hide}>
                Close
              </button>
              <button role="button" type="submit">
                Upload
              </button>
            </div>
          </footer>
        </article>
      </form>
    </dialog>
  );
}
