import { useState, useEffect } from 'react';
import { type SpeciesInfo } from '../lib/firebase';

type Props = {
  species: SpeciesInfo[];
};

type SpeciesFilters = Omit<SpeciesInfo, 'updatedAt'>;

const defaultFilters = {
  kingdom: '',
  order: '',
  family: '',
  species: 'a',
  sex: '',
  county: '',
  place: '',
  speciesLatin: '',
  image: '',
  date: '',
};

export default function SpeciesView({ species }: Props) {
  // const [sort, setSort] = useState<string>();
  const [filters, setFilter] = useState(defaultFilters);
  const [items, setItems] = useState<SpeciesInfo[]>();

  useEffect(() => {
    const applyFilters = (data: SpeciesFilters[]) =>
      data.filter((item) =>
        Object.entries(filters).every(([key, value]) => {
          if (typeof key !== 'string' || key === '') return true;
          const property = item[key as keyof SpeciesFilters];
          return property.includes(value);
        })
      );

    setItems(applyFilters(species));
    // console.log('filter');
  }, [species, filters]);

  const speciesTable =
    items &&
    items.map(({ kingdom, order, family, species, sex, speciesLatin, place, county, date, image, updatedAt }) => (
      <tr key={species}>
        <td>{kingdom}</td>
        <td>{order}</td>
        <td>{family}</td>
        <td>{species}</td>
        <td>{sex}</td>
        <td>{speciesLatin}</td>
        <td>{place}</td>
        <td>{county}</td>
        <td>{date}</td>
        {/* <td>{updatedAt.toDate().toLocaleDateString()}</td> */}
        <td>{image}</td>
      </tr>
    ));

  const onChange = (e: React.ChangeEvent<HTMLInputElement> | undefined) => {
    setFilter((prevValues) => {
      const id = e?.target.id;
      const value = e?.target.value || '';

      return typeof id === 'string' ? { ...prevValues, [id]: value } : prevValues;
    });
  };

  return (
    <div className="species-view">
      <form>
        <div className="grid">
          <label htmlFor="species">
            Art
            <input id="species" onChange={onChange} />
          </label>
          <label htmlFor="speciesLatin">
            Latinskt namn
            <input id="speciesLatin" onChange={onChange} />
          </label>

          <div></div>
          <div></div>
        </div>
      </form>

      <figure>
        <table className="species-table" role="grid">
          <thead>
            <tr>
              <th>Klass</th>
              <th>Ordning</th>
              <th>Familj</th>
              <th>Art</th>
              <th>Kön</th>
              <th>Latinskt namn</th>
              <th>Lokal</th>
              <th>Län</th>
              <th>Datum</th>
              {/* <th>Uppdaterad</th> */}
              <th>Bild</th>
            </tr>
          </thead>
          <tbody>{speciesTable}</tbody>
        </table>
      </figure>
    </div>
  );
}
