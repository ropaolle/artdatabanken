import classes from './SpeciesView.module.css';
import { useState, useEffect } from 'react';
import type { SpeciesInfo } from '../lib/firebase';
import { useStoreState, showSpeciesDialog } from '../state';
import Page from './Page';
import { TableHeader, type HeaderCellOnClick } from '../components';

const headerColumns = [
  [{ label: 'Klass', id: 'kingdom' }],
  [{ label: 'Order', id: 'order' }],
  [{ label: 'Familj som sover så sött', id: 'family' }],
  [{ label: 'Art', id: 'species' }],
  [{ label: 'Kön', id: 'sex' }],
  [{ label: 'Latinskt namn', id: 'speciesLatin' }],
  [
    { label: 'Lokal', id: 'place' },
    { label: 'Län', id: 'county' },
  ],
  [{ label: 'Datum', id: 'date' }],
  [{ label: 'Bild', id: 'image' }],
];

type SortKeys = Omit<SpeciesInfo, 'id' | 'updatedAt'>;

export default function SpeciesView() {
  const images = useStoreState('images');
  const species = useStoreState('species');
  const [sort, setSort] = useState({ column: 'species', ascending: false });
  const [filter, setFilter] = useState('');
  const [items, setItems] = useState(species);

  useEffect(() => {
    if (filter.length === 0) return setItems(species);

    const filteredSpecies = species.filter((item) =>
      Object.entries(item).some(([, value]) =>
        typeof value !== 'string' ? false : value.toLowerCase().includes(filter)
      )
    );

    setItems(filteredSpecies);
  }, [species, filter]);

  if (!images) return null;

  const localeSort = (a: SortKeys, b: SortKeys) => {
    if (!sort) return 0;
    const itemA = a[sort.column as keyof SortKeys];
    const itemB = b[sort.column as keyof SortKeys];
    const order = sort.ascending ? -1 : 1;

    return itemA.localeCompare(itemB, 'sv', { sensitivity: 'base' }) * order;
  };

  const getImage = (name: string) => images.find((image) => image.filename === name)?.thumbnailURL;

  const handleRowClick = (e: React.MouseEvent) => {
    showSpeciesDialog(
      true,
      species.find(({ id }) => id === e.currentTarget.id)
    );
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement> | undefined) => {
    setFilter(e?.target.value || '');
  };

  const handleHeaderClick: HeaderCellOnClick = (e, id) => {
    e.preventDefault();
    setSort({ column: id, ascending: sort.column === id ? !sort.ascending : sort.ascending });
  };

  const speciesTable = items
    .sort(localeSort)
    .map(({ id, kingdom, order, family, species, sex, speciesLatin, place, county, date, image }) => (
      <tr key={id} id={id} onClick={handleRowClick} className={classes.row}>
        <td>{kingdom}</td>
        <td>{order}</td>
        <td>{family}</td>
        <td>{species}</td>
        <td>{sex}</td>
        <td>{speciesLatin}</td>
        <td>
          <div>{place}</div>
          <div>{county}</div>
        </td>
        <td>{date}</td>
        <td>
          <img src={getImage(image)} alt={image} title={image} loading="lazy" />
        </td>
      </tr>
    ));

  return (
    <Page title="Arter" headerButtonTitle="Ny Art" onHeaderButtonClick={() => showSpeciesDialog(true)}>
      <form>
        <div className="grid">
          <label htmlFor="all">
            Fritextsökning
            <input id="all" onChange={handleFilterChange} />
          </label>
        </div>
      </form>

      <figure>
        <table className="species-table" role="grid">
          <TableHeader columns={headerColumns} sort={sort} onClick={handleHeaderClick} />
          <tbody>{speciesTable}</tbody>
        </table>
      </figure>
    </Page>
  );
}
