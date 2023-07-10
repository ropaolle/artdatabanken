import classes from './SpeciesView.module.css';
import { useState, useEffect } from 'react';
import { useStoreState, showSpeciesDialog } from '../../state';
import Page from './../Page';
import { TableHeader, type HeaderCellOnClick, Pager } from '../../components';
import Filters from './Filters';
import { type SpeciesInfo } from '../../lib/firebase';

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

const pageSize = 50;

export default function SpeciesView() {
  const images = useStoreState('images');
  const species = useStoreState('species');
  const [thumbnails, setThumbnails] = useState<Map<string, string>>(new Map());
  const [sort, setSort] = useState({ column: 'species', ascending: false });
  const [items, setItems] = useState<SpeciesInfo[]>();
  const [page, setPage] = useState(0);
  const [pagedItems, setPagedItems] = useState<SpeciesInfo[]>();

  // console.log('images', images);

  useEffect(() => {
    // if (!items) return;
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

  // const getImage = (name: string) =>
  //   images.find((image) => {
  //     if (image.filename === name) {
  //       console.log('image, name', image.filename, name, image.filename === name);
  //     }
  //     return image.filename === name;
  //   })?.thumbnail;

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
      {pagedItems &&
        pagedItems.map(({ id, kingdom, order, family, species, sex, speciesLatin, place, county, date, image }) => (
          <tr key={id} id={id} onClick={handleRowClick} className={classes.row}>
            <td>
              <div>{kingdom}</div>
              <div>{order}</div>
              <div>{family}</div>
            </td>
            <td>{species}</td>
            <td>
              <div>{speciesLatin}</div>
              <div>{sex}</div>
            </td>
            <td>
              <div>{place}</div>
              <div>{county}</div>
              <div>{date}</div>
            </td>
            {/* <td>{thumbnails.get(image.trim())}</td> */}
            <td>
              <img src={thumbnails.get(image.trim())} alt={'' /* image */} title={image} /* loading="lazy" */ />
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
      <Pager active={page} count={items?.length || 0} pageSize={pageSize} onClick={setPage} />
    </Page>
  );
}
