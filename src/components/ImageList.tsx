import { useEffect, useState } from 'react';
import { getFiles } from '../lib/firebase.ts';

type Props = {
  open: boolean;
  show: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ImageList({ open, show }: Props) {
  const [imgList, setImgList] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getFiles('files');
      setImgList(data);
    };

    fetchData().catch(console.error);
  }, []);

  // useEffect(() => {
  //   getFiles('files').then((data) => {
  //     setImgList(data);
  //     // console.log('data', data);
  //   });
  // }, []);

  const hide = (e: React.FormEvent) => {
    e.preventDefault();
    show(false);
  };

  const images = imgList.map((image) => <td key={image}>{image}</td>);

  return (
    <dialog id="modal-example" open={open}>
      <article>
        <a href="#" aria-label="Close" className="close" onClick={hide}></a>
        <h3>Bilder</h3>
        <table>
          <thead>
            <tr>
              <th scope="col">Heading</th>
              <th scope="col">Heading</th>
              <th scope="col">Heading</th>
              <th scope="col">Heading</th>
              <th scope="col">Heading</th>
              <th scope="col">Heading</th>
            </tr>
          </thead>
          <tbody>
            <tr>{images}</tr>
            <tr>
              <td>Cell</td>
              <td>Cell</td>
              <td>Cell</td>
              <td>Cell</td>
              <td>Cell</td>
            </tr>
            <tr>
              <td>Cell</td>
              <td>Cell</td>
              <td>Cell</td>
              <td>Cell</td>
              <td>Cell</td>
            </tr>
          </tbody>
        </table>
      </article>
    </dialog>
  );
}
