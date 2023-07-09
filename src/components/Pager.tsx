import classes from './Pager.module.css';
import { useState, useEffect } from 'react';

type Props = {
  active: number;
  count: number;
  pageSize: number;
  onClick: (next: number) => void;
};

``;
export default function Pager({ active, count, pageSize, onClick }: Props) {
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    setPageCount(Math.ceil(count / pageSize));
  }, [count, pageSize]);

  if (pageCount < 1) return null;

  const handleClick = (id: string) => {
    onClick(Number(id));
  };

  const Pager = () =>
    [...Array(pageCount).keys()].map((page) => (
      // <div key={page} className={classes.page2}>
      <a
        href="#"
        key={page}
        id={String(page)}
        className={`${classes.page} ${page === active ? classes.active : ''}`}
        onClick={(e) => handleClick(e.currentTarget.id)}
      >
        {page}
      </a>
      // </div>
    ));

  return (
    <div className={classes.pager}>
      <Pager />
    </div>
  );
}
