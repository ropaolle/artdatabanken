import { toOptions } from '../../lib/options';
import { type SortProps } from '../../lib';

type SortState<T> = { label: string; value: string } & SortProps<T>;

const sortStates: SortState<ImageInfo>[] = [
  { label: 'Filnamn (stigande)', value: '0', property: 'filename', order: 'asc' },
  { label: 'Filnamn (fallande)', value: '1', property: 'filename', order: 'desc' },
  { label: 'Datum (stigande)', value: '2', property: 'updatedAt', order: 'asc' },
  { label: 'Datum (fallande)', value: '3', property: 'updatedAt', order: 'desc' },
];

type Props = {
  setFilter: (value: string) => void;
  setSort: (value: SortState<ImageInfo>) => void;
};

export default function FilterAndSortForm({ setFilter, setSort }: Props) {
  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  const handleSortChange = (value: string) => {
    setSort(sortStates[Number(value)]);
  };

  return (
    <form>
      <div className="grid">
        <label htmlFor="all">
          Filnamn
          <input id="all" onChange={(e) => handleFilterChange(e.target.value)} />
        </label>

        <label htmlFor="sort">
          Sortering
          <select id="sort" onChange={(e) => handleSortChange(e.target.value)}>
            {toOptions(sortStates)}
          </select>
        </label>
      </div>
    </form>
  );
}
