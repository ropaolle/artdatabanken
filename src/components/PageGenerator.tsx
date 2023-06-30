import { type ImageInfo } from '../lib/firebase';
import { Dialogs } from '.';

type Props = {
  // images: ImageInfo[];
  // show: (dialog: number, show?: boolean) => void;
};

export default function PageGenerator({}: /* images, show */ Props) {
  return (
    <div className="page-generator">
      <div className="grid">
        <h1 id="images">Sidgenerator</h1>
        <div className="header-buttons">
          <a href="#" role="button">
            Skriv ut
          </a>
        </div>
      </div>
      <div className="gallery">{}</div>
    </div>
  );
}
