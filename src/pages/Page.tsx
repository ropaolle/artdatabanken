import classes from './Page.module.css';
import { useAppStore } from '../lib/state';

type PageProps = {
  id?: string;
  title?: string;
  children: React.ReactNode;
  headerButtonTitle?: string;
  headerButtonDisabled?: boolean;
  onHeaderButtonClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export default function Page({
  id,
  title,
  children,
  headerButtonTitle,
  headerButtonDisabled = false,
  onHeaderButtonClick,
}: PageProps) {
  const user = useAppStore((state) => state.user);

  return (
    <main className={`container ${id ? id : ''}  ${classes.main}`}>
      <div className="grid">
        {title && <h1>{title}</h1>}
        {headerButtonTitle && (
          <div className={classes.button}>
            <button className={classes.inline} onClick={onHeaderButtonClick} disabled={!user || headerButtonDisabled}>
              {headerButtonTitle}
            </button>
          </div>
        )}
      </div>
      {children}
    </main>
  );
}
