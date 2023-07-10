import classes from './Page.module.css';

type PageProps = {
  id?: string;
  title?: string;
  children: React.ReactNode;
  headerButtonTitle?: string;
  onHeaderButtonClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export default function Page({ id, title, children, headerButtonTitle, onHeaderButtonClick }: PageProps) {
  return (
    <main className={`container ${id ? id : '' }  ${classes.main}`}>
      <div className="grid">
        {title && <h1>{title}</h1>}
        {headerButtonTitle && (
          <div className={classes.button}>
            <button className={classes.inline} onClick={onHeaderButtonClick}>
              {headerButtonTitle}
            </button>
          </div>
        )}
      </div>
      {children}
    </main>
  );
}
