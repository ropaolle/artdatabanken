import classes from './Page.module.css';

type PageProps = {
  title?: string;
  children: React.ReactNode;
  headerButtonTitle?: string;
  onHeaderButtonClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export default function Page({ title, children, headerButtonTitle, onHeaderButtonClick }: PageProps) {
  return (
    <main className={`container ${classes.main}`}>
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
