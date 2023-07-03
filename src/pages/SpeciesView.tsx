// import './SpeciesView.css';
import classes from './SpeciesView.module.css';
import { useState /* , useEffect */ } from 'react';
import type { SpeciesInfo /* , ImageInfo */ } from '../lib/firebase';
// import { Icon } from '@iconify/react';
// import { Dialogs } from '../dialogs';
import { useStoreState, showSpeciesDialog } from '../state';
import Page from './Page';
import { TableHeader, type SortType, type HeaderCellOnClick } from '../components';
// import { DialogTypes } from '../dialogs';

// interface ItemInfo extends Omit<SpeciesInfo, 'updatedAt'> {
//   all: string;
// }

// console.log('classes', classes);

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


export default function SpeciesView() {
  const images = useStoreState('images');
  const species = useStoreState('species');
  const [sort, setSort] = useState({ column: 'species', ascending: false });
  const [filters, setFilter] = useState({ all: '' });
  // const [items, setItems] = useState(value?.species);

  console.log('filter', filters);

  // console.log('species', species);

  // TODO: Add filter functionality
  // useEffect(() => {
  //   const filteredSpecies = value.species.filter((item) => {
  //     // Free text filter
  //     if (filters.all && filters.all !== '') {
  //       return Object.entries(item).some(([, value]) => {
  //         if (typeof value !== 'string') return false;
  //         return value.toLowerCase().includes(filters.all);
  //       });
  //     }

  //     // Column filter
  //     return Object.entries(filters).every(([key, value]) => {
  //       if (typeof key !== 'string' || key === '' || key === 'all') return true;
  //       const property = item[key as keyof ItemInfo];
  //       return property?.includes(value.toLowerCase());
  //     });
  //   });

  //   setItems(filteredSpecies);
  // }, [value.species, filters]);

  if (!images) return null;

  // TODO: Refactor to be cleaner in TypeScript
  const localeSort = (a: SpeciesInfo, b: SpeciesInfo) => {
    const itemA = a[sort.column as keyof SpeciesInfo];
    const itemB = b[sort.column as keyof SpeciesInfo];
    if (!itemA || typeof itemA !== 'string' || !itemB || typeof itemB !== 'string') return 0;
    const localeCompare = itemA.localeCompare(itemB, 'sv', { sensitivity: 'base' });
    // Set sort order
    return sort.ascending ? -localeCompare : localeCompare;
  };

  const handleRowClick = (e: React.MouseEvent) => {
    const selected = species.find(({ id }) => id === e.currentTarget.id);
    if (selected) {
      showSpeciesDialog(true, selected);
    }
  };

  const getImage = (name: string) => images.find((image) => image.filename === name);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement> | undefined) => {
    setFilter((prevValues) => {
      const id = e?.target.id;
      const value = e?.target.value || '';

      return typeof id === 'string' ? { ...prevValues, [id]: value.toLowerCase() } : prevValues;
    });
  };

  const handleHeaderClick: HeaderCellOnClick = (e, id) => {
    e.preventDefault();
    setSort({ column: id, ascending: sort.column === id ? !sort.ascending : sort.ascending });
  };



  const speciesTable = species
    .sort(localeSort)
    .map(({ id, kingdom, order, family, species, sex, speciesLatin, place, county, date, image }) => (
      <tr key={id} id={id} onClick={handleRowClick} className={classes.row}>
        {/* <td>{id}</td> */}
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
        {/* <td>{place}</td>
        <td>{county}</td> */}
        <td>{date}</td>
        <td>
          <img src={getImage(image)?.thumbnailURL} alt={image} title={image} loading="lazy" />
        </td>
      </tr>
    ));

  return (
    <Page title="Arter" headerButtonTitle="Ny Art" onHeaderButtonClick={() => showSpeciesDialog(true)}>
      <form>
        <div className="grid">
          {/* INFO: Free text filters overrides column filters. */}
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
