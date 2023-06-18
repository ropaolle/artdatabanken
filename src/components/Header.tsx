type Props = {
  
  show: () => undefined;
};

export default function Header({ show }: Props) {
  return (
    <header className="container">
      <nav>
        <ul>
          <li>
            <strong>Brand</strong>
          </li>
        </ul>
        <ul>
          <li>
            <a href="#">Link</a>
          </li>
          <li>
            <a
              // href={`/api/auth/signin`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                show();
                // signIn();
              }}
            >
              Sign in
            </a>
          </li>
          <li>
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
          </li>
        </ul>
      </nav>
    </header>
  );
}
