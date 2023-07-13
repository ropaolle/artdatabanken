import classes from './SpeciesView.module.css';
import { useState, useEffect } from 'react';
import { useStoreState } from '../../state';
import Page from './../Page';
import { TableHeader, type HeaderCellOnClick, Pager } from '../../components';
import Filters from './Filters';
import { type SpeciesInfo } from '../../lib/firebase';
import { sexesMap, countiesMap } from '../../lib/options';
import { SpeciesDialog } from '../../dialogs';

const pageSize = 50;

const headerColumns = [
  [
    { label: 'Klass', id: 'kingdom' },
    { label: 'Order', id: 'order' },
    { label: 'Familj', id: 'family' },
  ],
  [{ label: 'Art', id: 'species' }],

  [
    { label: 'Latinskt namn', id: 'speciesLatin' },
    { label: 'Kön', id: 'sex' },
  ],
  [
    { label: 'Lokal', id: 'place' },
    { label: 'Län', id: 'county' },
    { label: 'Datum', id: 'date' },
  ],
  [{ label: 'Bild', id: 'image' }],
];

export default function SpeciesView() {
  const images = useStoreState('images');
  const species = useStoreState('species');
  const [dialog, showDialog] = useState(false);
  const [dialogValues, setDialogValues] = useState<SpeciesInfo>();
  const [thumbnails, setThumbnails] = useState<Map<string, string>>(new Map());
  const [sort, setSort] = useState({ column: 'species', ascending: false });
  const [items, setItems] = useState<SpeciesInfo[]>();
  const [page, setPage] = useState(0);
  const [pagedItems, setPagedItems] = useState<SpeciesInfo[]>();

  useEffect(() => {
    setThumbnails((prevValue) => {
      for (const { filename, thumbnailURL } of images) {
        prevValue.set(filename, thumbnailURL);
      }

      return prevValue;
    });
  }, [images]);

  useEffect(() => {
    if (!items) return;

    setPagedItems(items.slice(page * pageSize, (page + 1) * pageSize));
  }, [items, page]);

  const handleRowClick = (e: React.MouseEvent) => {
    const currentSpecies = species.find(({ id }) => id === e.currentTarget.id);
    if (currentSpecies) {
      setDialogValues(currentSpecies);
      showDialog(true);
    }
  };

  const handleHeaderClick: HeaderCellOnClick = (e, id) => {
    e.preventDefault();
    setSort({ column: id, ascending: sort.column === id ? !sort.ascending : sort.ascending });
  };

  const TableBody = () => (
    <tbody>
      {pagedItems &&
        pagedItems.map(({ id, kingdom, order, family, species, sex, speciesLatin, place, county, date, image }) => (
          <tr key={id} id={id} onClick={handleRowClick} className={classes.row}>
            <td>
              <div>{kingdom}</div>
              <div>{order}</div>
              <div>
                <ins>{family}</ins>
              </div>
            </td>
            <td>
              <b>{species}</b>
            </td>
            <td>
              <div>{speciesLatin}</div>
              <div>
                <i>{sexesMap.get(sex) || sex}</i>
              </div>
            </td>
            <td>
              <div>{place}</div>
              <div>
                <ins>{countiesMap.get(county)}</ins>
              </div>
              <div>{date}</div>
            </td>
            <td>
              <img src={thumbnails.get(image.trim())} alt={'' /* image */} title={image} /* loading="lazy" */ />
            </td>
          </tr>
        ))}
    </tbody>
  );

  return (
    <Page title="Arter" headerButtonTitle="Ny Art" onHeaderButtonClick={() => showDialog(true)}>
      <SpeciesDialog open={dialog} show={showDialog} values={dialogValues} />

      <Filters setItems={setItems} sort={sort} />
      <figure>
        <table className="species-table" role="grid">
          <TableHeader columns={headerColumns} sort={sort} onClick={handleHeaderClick} />
          <TableBody />
        </table>
      </figure>
      <Pager active={page} count={items?.length || 0} pageSize={pageSize} onClick={setPage} />
    </Page>
  );
}
