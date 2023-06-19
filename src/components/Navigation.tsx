import logo from '../assets/logo.svg';

type Props = {
  show: () => void;
  images: () => void;
};

export default function Navigation({ show, images }: Props) {
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
            <a href="#">Sidgenerator</a>
          </li>
          {/* <li>
            <a href="#">Bilder</a>
          </li> */}
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                images();
              }}
            >
              Bilder
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                show();
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
