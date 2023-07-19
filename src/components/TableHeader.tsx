import classes from './TableHeader.module.css';
import { Icon } from '@iconify/react';
import { SortProp } from '../lib';

type HeaderCellType = { label: string; id: string };

export type HeaderCellOnClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) => void;

type Props<T> = {
  columns: HeaderCellType[][];
  sort: SortProp<T>;
  onClick: HeaderCellOnClick;
};

export default function TableHeader<T>({ columns, sort, onClick }: Props<T>) {
  const HeaderCell = ({ label, id }: HeaderCellType) => (
    <a href="#" className={classes.headerCell} onClick={(e) => onClick(e, id)}>
      {label}
      {sort.column === id && (
        <Icon icon={`material-symbols:keyboard-arrow-${sort.order === 'asc' ? 'up' : 'down'}-rounded`} />
      )}
    </a>
  );

  return (
    <thead>
      <tr>
        {columns.map((column) => (
          <th key={column[0].id}>
            {column.map(({ label, id }) => (
              <div key={id}>
                <HeaderCell label={label} id={id} />
              </div>
            ))}
          </th>
        ))}
      </tr>
    </thead>
  );
}
