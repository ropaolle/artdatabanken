import { useState } from 'react';
import { storage } from '../firebase.ts';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

export default function UploadImage() {
  const [imgUrl, setImgUrl] = useState<null | string>(null);
  const [progresspercent, setProgresspercent] = useState(0);

  const handleSubmit = (e: any) => {
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
  return (
    <>
      <form onSubmit={handleSubmit} className="form">
        <input type="file" />
        <button type="submit">Upload</button>
      </form>

      <progress value={progresspercent} max="100" />
      <div>{progresspercent}%</div>

      {imgUrl && <img src={imgUrl} alt="uploaded file" height={200} />}
    </>
  );
}
