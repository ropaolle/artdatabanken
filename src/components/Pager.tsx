import classes from './Pager.module.css';
import { useState, useEffect } from 'react';

type Props = {
  active: number;
  count: number;
  pageSize: number;
  onClick: (next: number) => void;
};

export default function Pager({ active, count, pageSize, onClick }: Props) {
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    setPageCount(Math.ceil(count / pageSize));
  }, [count, pageSize]);

  if (pageCount < 1) return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClick(Number(e.currentTarget.id));
  };

  const Pager = () =>
    [...Array(pageCount).keys()].map((page) => (
      <a
        href="#"
        key={page}
        id={String(page)}
        className={`${classes.page} ${page === active ? classes.active : ''}`}
        onClick={handleClick}
      >
        {page}
      </a>
    ));

  return (
    <div className={classes.pager}>
      <Pager />
    </div>
  );
}
