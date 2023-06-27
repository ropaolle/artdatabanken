import { useState, useEffect } from 'react';
import { type SpeciesInfo } from '../lib/firebase';

// type SpeciesInfo2 = {
//   kingdom: string;
//   order: string;
//   family: string;
//   species: string;
//   sex: string;
//   county: string;
//   place: string;
//   speciesLatin: string;
//   image: string;
//   date: string;
//   // updatedAt?: Timestamp;
// };

type Props = {
  species: SpeciesInfo[];
};

const defaultFilters = [
  { name: 'kingdom', value: '' },
  { name: 'order', value: '' },
  { name: 'family', value: '' },
  { name: 'species', value: 'a' },
  { name: 'sex', value: '' },
  { name: 'county', value: '' },
  { name: 'place', value: '' },
  { name: 'speciesLatin', value: '' },
  { name: 'image', value: '' },
  { name: 'date', value: '' },
];

// type Filter = {
//   name: string;
//   value: string;
// };
// const defaultFilters /* : Filter[] */ = [
//   { name: '', value: '' },
//   { name: 'species', value: '' },
//   { name: 'speciesLatin', value: '' },
// ];

// type ResultType = {
//   [key: string]: string;
// };

export default function SpeciesView({ species }: Props) {
  const [sort, setSort] = useState<string>();
  const [filters, setFilter] = useState(defaultFilters);
  const [items, setItems] = useState<SpeciesInfo[]>([]);

  // useEffect(() => {
  //   console.log(filters)
  // }, [filters]);

  // const applyFilters = (data: SpeciesInfo[]) =>
  //   data.filter((item) => {
  //     return filters.every(({ name, value } /* : Filter */) => {
  //       const key = item[name as keyof SpeciesInfo];
  //       if (typeof key !== 'string' || key === '') return false;
  //       return key.includes(value);
  //     });
  //   });

  //   console.log('filters', filters);

  // const speciesTable = applyFilters(species).map(
  const speciesTable = items.map(
    ({ kingdom, order, family, species, sex, speciesLatin, place, county, date, image, updatedAt }) => (
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
    )
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement> | undefined) => {
    // const { id, value } = e?.target;


    setFilter(prevValues => {
      // console.log('prevValues', prevValues);
      const filter = filters.find(({ name }) => name === e?.target.id);
      if (filter) {
        filter.value = e?.target.value || '';
      }

      return prevValues
    })

   /*  const updatedFilters = filters.map(({ filter }) => {
      filter.name === e?.target.id 
    });

    const filter = filters.find(({ name }) => name === e?.target.id);
    if (filter) {
      filter.value = e?.target.value || '';
    }

    con sole.log('filters', filters);*/
    /*  if (e?.target.id) {
      console.log('e.target', e.target.value, e.target.id);
      const filter = filters.find(({ name }) => name === e.target.id);
      filter?.value = e.target.value;
    } */
  };

  // applyFilters(species);

  return (
    <div className="species-view">
      <form>
        <div className="grid">
          <label htmlFor="species">
            Art
            {/* <select id="species">
              <option value="">…</option>
            </select> */}
            <input id="species" onChange={onChange} />
            {/* <input id="species" onChange={(e) => onChange(e)} /> */}
          </label>

          <label htmlFor="date">Datum</label>

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
