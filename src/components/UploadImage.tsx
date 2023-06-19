import { useState } from 'react';
import { storage, db } from '../lib/firebase.ts';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';

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

  const handleSubmit = async (e: React.FormEvent<CustomFormElement>) => {
    e.preventDefault();

    const file = e.currentTarget.elements.imageFiles?.files?.[0];
    if (!file) return;
    const path = `files/${file.name}`;

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
          setDoc(doc(db, 'images', file.name), {
            filename: file.name,
            downloadURL,
            updatedAt: serverTimestamp(),
            // timestamp: Timestamp,
          }).catch((error) => console.log(error));
        });
      }
    );
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement> | undefined) => {
    // Clear form
    setImgUrl(null);
    setProgresspercent(0);

    // Update
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
          <p>Ladda upp en ny eller ersätt en befintlig bild. För snyggast resultat bör formatet vara kvadratiskt.</p>
          <p>
            <input type="file" id="imageFiles" onChange={handleChange} />
          </p>
          <div className="center">
            {!imgUrl && progresspercent > 0 && (
              <>
                <progress value={progresspercent} max="100" />
                {progresspercent}%
              </>
            )}
            {imgUrl && <img src={imgUrl} alt="uploaded file" width={400} />}
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
