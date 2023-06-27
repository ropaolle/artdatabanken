import { useState, useEffect } from 'react';
import { type SpeciesInfo } from '../lib/firebase';
import { Icon } from '@iconify/react';

type Filters = Omit<SpeciesInfo, 'updatedAt'>;

type Props = {
  species: SpeciesInfo[];
};

export default function SpeciesView({ species }: Props) {
  const [sort, setSort] = useState({ column: '', ascending: true });
  const [filters, setFilter] = useState({ kingdom: '' });
  const [items, setItems] = useState(species);

  useEffect(() => {
    const filteredSpecies = species.filter((item) =>
      Object.entries(filters).every(([key, value]) => {
        if (typeof key !== 'string' || key === '') return true;
        // FIXA: updatedAt omitted as this only works on filters with string values
        const property = item[key as keyof Filters];
        return property.toLowerCase().includes(value.toLowerCase());
      })
    );

    setItems(filteredSpecies);
  }, [species, filters]);

  const localeSort = (a: SpeciesInfo, b: SpeciesInfo) => {
    // Ignore sort
    if (sort.column === '') return 0;
    // Compare columns
    const column = sort.column as keyof Filters;
    const localeCompare = a[column].localeCompare(b[column], 'sv', { sensitivity: 'base' });
    // Sort order
    return sort.ascending ? -localeCompare : localeCompare;
  };

  const speciesTable = items
    .sort(localeSort)
    .map(({ kingdom, order, family, species, sex, speciesLatin, place, county, date, image /* , updatedAt */ }) => (
      <tr key={species}>
        <td>{kingdom}</td>
        <td>{order}</td>
        <td>{family}</td>
        <td>{species}</td>
        <td>{sex}</td>
        <td>{speciesLatin}</td>
        {/* <td>
          <div>{place}</div>
          <div>{county}</div>
          <div>{date}</div>
        </td> */}
        <td>{place}</td>
        <td>{county}</td>
        <td>{date}</td>
        <td>{image}</td>
      </tr>
    ));

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement> | undefined) => {
    setFilter((prevValues) => {
      const id = e?.target.id;
      const value = e?.target.value || '';

      return typeof id === 'string' ? { ...prevValues, [id]: value } : prevValues;
    });
  };

  const handleTableSortClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) => {
    e.preventDefault();
    setSort({ column: id, ascending: sort.column === id ? !sort.ascending : sort.ascending });
  };

  const HeaderCell = ({ header, id }: { header: string; id: string }) => (
    <th>
      <a href="#" onClick={(e) => handleTableSortClick(e, id)}>
        {header}
        {sort.column === id && (
          <Icon icon={`material-symbols:keyboard-arrow-${sort.ascending ? 'up' : 'down'}-rounded`} />
        )}
      </a>
    </th>
  );

  return (
    <div className="species-view">
      <form>
        <div className="grid">
          {/* <label htmlFor="all">
            Filter
            <input id="all" onChange={handleFilterChange} />
          </label> */}

          <label htmlFor="species">
            Art
            <input id="species" onChange={handleFilterChange} />
          </label>

          <label htmlFor="speciesLatin">
            Latinskt namn
            <input id="speciesLatin" onChange={handleFilterChange} />
          </label>

          <div></div>
          <div></div>
        </div>
      </form>

      <figure>
        <table className="species-table" role="grid">
          <thead>
            <tr>
              <HeaderCell header="Klass" id="kingdom" />
              <HeaderCell header="Order" id="order" />
              <HeaderCell header="Familj" id="family" />
              <HeaderCell header="Art" id="species" />
              <HeaderCell header="Kön" id="sex" />
              <HeaderCell header="Latinskt namn" id="speciesLatin" />
              <HeaderCell header="Lokal" id="place" />
              <HeaderCell header="Län" id="county" />
              <HeaderCell header="Datum" id="date" />
              <HeaderCell header="Bild" id="image" />
            </tr>
          </thead>
          <tbody>{speciesTable}</tbody>
        </table>
      </figure>
    </div>
  );
}
