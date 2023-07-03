import classes from './TableHeader.module.css';
import { Icon } from '@iconify/react';

type HeaderCellType = { label: string; id: string };
type HeaderCellsType = HeaderCellType[][];

export type SortType = { column: string; ascending: boolean };
export type HeaderCellOnClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) => void;

type Props = {
  columns: HeaderCellsType;
  sort: SortType;
  onClick: HeaderCellOnClick;
};

export default function TableHeader({ columns, sort, onClick }: Props) {
  const HeaderCell = ({ label, id }: HeaderCellType) => (
    <a href="#" className={classes.headerCell} onClick={(e) => onClick(e, id)}>
      {label}
      {sort.column === id && (
        <Icon icon={`material-symbols:keyboard-arrow-${sort.ascending ? 'up' : 'down'}-rounded`} />
      )}
    </a>
  );

  return (
    <thead>
      <tr>
        {columns.map((column) => (
          <th key={column[0].id}>
            {column.map(({ label, id }) => (
              <div>
                <HeaderCell label={label} id={id} />
              </div>
            ))}
          </th>
        ))}
      </tr>
    </thead>
  );
}
