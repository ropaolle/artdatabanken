import { useState, useEffect } from 'react';
import { useStoreState } from '../../state';
import { type Options, toOptions, createSortFunc } from '../../lib';
import { SpeciesInfo } from '../../lib/firebase';

type Props = {
  setItems: React.Dispatch<SpeciesInfo[]>;
  sort: { column: string; ascending: boolean };
};

export default function Filters({ sort, setItems }: Props) {
  const images = useStoreState('images');
  const species = useStoreState('species');
  const [speciesOptions, setSpeciesOptions] = useState<Options[]>([]);
  const [filters, setFilters] = useState({ all: '', species: '', kingdom: '' });

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

    setItems(filteredSpecies.sort(createSortFunc(sort)));
  }, [species, filters, sort, setItems]);

  if (!images) return null;

  const handleFilterChange = (id: string, value: string) => setFilters((prevValue) => ({ ...prevValue, [id]: value }));

  return (
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
  );
}
