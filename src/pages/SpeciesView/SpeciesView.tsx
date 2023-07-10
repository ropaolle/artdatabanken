import classes from './SpeciesView.module.css';
import { useState, useEffect } from 'react';
import { useStoreState, showSpeciesDialog } from '../../state';
import Page from './../Page';
import { TableHeader, type HeaderCellOnClick, Pager } from '../../components';
import Filters from './Filters';

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

const pageSize = 3;

export default function SpeciesView() {
  const images = useStoreState('images');
  const species = useStoreState('species');
  const [sort, setSort] = useState({ column: 'species', ascending: false });
  const [items, setItems] = useState(species);
  const [page, setPage] = useState(0);
  const [pagedItems, setPagedItems] = useState(items);

  useEffect(() => {
    setPagedItems(items.slice(page * pageSize, (page + 1) * pageSize));
  }, [items, page]);

  const getImage = (name: string) => images.find((image) => image.filename === name)?.thumbnailURL;

  const handleRowClick = (e: React.MouseEvent) => {
    showSpeciesDialog(
      true,
      species.find(({ id }) => id === e.currentTarget.id)
    );
  };

  const handleHeaderClick: HeaderCellOnClick = (e, id) => {
    e.preventDefault();
    setSort({ column: id, ascending: sort.column === id ? !sort.ascending : sort.ascending });
  };

  const TableBody = () => (
    <tbody>
      {pagedItems.map(({ id, kingdom, order, family, species, sex, speciesLatin, place, county, date, image }) => (
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
      ))}
    </tbody>
  );

  return (
    <Page title="Arter" headerButtonTitle="Ny Art" onHeaderButtonClick={() => showSpeciesDialog(true)}>
      <Filters setItems={setItems} sort={sort} />
      <figure>
        <table className="species-table" role="grid">
          <TableHeader columns={headerColumns} sort={sort} onClick={handleHeaderClick} />
          <TableBody />
        </table>
      </figure>
      <Pager active={page} count={items.length} pageSize={pageSize} onClick={setPage} />
    </Page>
  );
}
