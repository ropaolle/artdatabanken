import logo from '../assets/logo.svg';
import { Dialogs } from '.';

type Props = {
  show: (dialog: number, show?: boolean) => void;
};

export default function Navigation({ show }: Props) {
  return (
    <header className="container">
      <nav>
        <ul>
          <li>
            <img src={logo} className="logo" alt="Logo" height={24} width={24} /> Artdatabanken
          </li>
        </ul>
        <ul>
          <li>
            {/* <a href="#speices">Arter</a> */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                show(Dialogs.ADD_SPECIES_DIALOG);
              }}
            >
              Ny art
            </a>
          </li>
          {/* <li>
            <a href="#">Bilder</a>
          </li> */}
          <li>
            <a
              href="#images"
              // onClick={(e) => {
              //   e.preventDefault();
              //   images();
              // }}
            >
              Bilder
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                show(Dialogs.UPLOAD_IMAGE_DIALOG);
              }}
            >
              Ladda upp
            </a>
          </li>
          {/* <li>
            <details role="list" dir="rtl">
              <summary aria-haspopup="listbox" role="link" className="contrast">
                Theme
              </summary>
              <ul role="listbox">
                <li>
                  <a href="#" data-theme-switcher="auto">
                    Auto
                  </a>
                </li>
                <li>
                  <a href="#" data-theme-switcher="light">
                    Light
                  </a>
                </li>
                <li>
                  <a href="#" data-theme-switcher="dark">
                    Dark
                  </a>
                </li>
              </ul>
            </details>
          </li> */}
        </ul>
      </nav>
    </header>
  );
}
