import classes from './Footer.module.css';

export default function Footer() {
  return (
    <footer className="container">
      <div className={classes.footer}>
        &copy; RopaOlle.se 2023, version {APP_VERSION} ({NODE_ENV})
      </div>
    </footer>
  );
}
