import classes from './SpeciesView.module.css';
import { useState, useEffect } from 'react';
import type { SpeciesInfo } from '../lib/firebase';
import { useStoreState, showSpeciesDialog } from '../state';
import Page from './Page';
import { TableHeader, type HeaderCellOnClick } from '../components';
import { type Options, toOptions } from '../lib';

const headerColumns = [
  [{ label: 'Klass', id: 'kingdom' }],
  [{ label: 'Order', id: 'order' }],
  [{ label: 'Familj', id: 'family' }],
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

type SortKeys = Omit<SpeciesInfo, 'id' | 'createdAt' | 'updatedAt'>;

export default function SpeciesView() {
  const images = useStoreState('images');
  const species = useStoreState('species');
  const [speciesOptions, setSpeciesOptions] = useState<Options[]>([]);
  const [sort, setSort] = useState({ column: 'species', ascending: false });
  const [filters, setFilters] = useState({ all: '', species: '', kingdom: '' });
  const [items, setItems] = useState(species);

  useEffect(() => {
    const filtered = filters.kingdom === '' ? species : species.filter(({ kingdom }) => kingdom === filters.kingdom);
    const options = filtered.map(({ id, species }) => ({ value: id || '', label: species }));

    // Reset species filter
    if (filters.species && !options.find(({ value }) => filters.species === value)) {
      setFilters((prevValue) => ({ ...prevValue, species: '' }));
    }

    setSpeciesOptions(options);
  }, [species, filters]);

  useEffect(() => {
    const { kingdom, species: speciesFilter, all } = filters;

    const filteredSpecies = species.filter((item) => {
      let freeTextSearchHit = false;

      for (const [key, value] of Object.entries(item)) {
        if (typeof value !== 'string') continue;

        if (
          (key === 'kingdom' && kingdom && kingdom !== value) ||
          (key === 'id' && speciesFilter && speciesFilter !== value)
        ) {
          return false;
        }

        if (all && value.toLowerCase().includes(all)) {
          freeTextSearchHit = true;
        }
      }

      return all === '' || freeTextSearchHit;
    });

    setItems(filteredSpecies);
  }, [species, filters]);

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

  const handleFilterChange = (id: string, value: string) => setFilters((prevValue) => ({ ...prevValue, [id]: value }));

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
          <img src={getImage(image)} alt={'' /* image */} title={image} loading="lazy" />
        </td>
      </tr>
    ));

  return (
    <Page title="Arter" headerButtonTitle="Ny Art" onHeaderButtonClick={() => showSpeciesDialog(true)}>
      <form>
        <div className="grid">
          <label htmlFor="kingdom">
            Klass
            <select id="kingdom" onChange={(e) => handleFilterChange(e.target.id, e.target.value)}>
              <option value="" defaultValue={filters.kingdom}>
                Alla…
              </option>
              <option>Fåglar</option>
              <option>Fröväxter</option>
            </select>
          </label>

          <label htmlFor="species">
            Art
            <select id="species" onChange={(e) => handleFilterChange(e.target.id, e.target.value)}>
              <option value="" defaultValue={filters.species}>
                Alla…
              </option>
              {toOptions(speciesOptions)}
            </select>
          </label>

          <label htmlFor="all">
            Fritextsökning
            <input id="all" onChange={(e) => handleFilterChange(e.target.id, e.target.value)} />
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
