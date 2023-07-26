import { useState, useEffect } from 'react';
import { createCompareFn, type SortProps } from '../../lib';
import { toDatalistOptions } from '../../lib/options';
import { SpeciesInfo } from '../../lib/firebase';
import { useAppStore } from '../../state';

type Props = {
  setItems: React.Dispatch<SpeciesInfo[]>;
  sort: SortProps<SpeciesInfo>;
};

export default function Filters({ sort, setItems }: Props) {
  const { images, species } = useAppStore();

  const [speciesOptions, setSpeciesOptions] = useState<string[]>([]);
  const [filters, setFilters] = useState({ all: '', species: '', kingdom: '' });

  useEffect(() => {
    // Filter species on kingdom
    const filteredSpecies =
      filters.kingdom === '' ? species : species.filter(({ kingdom }) => kingdom === filters.kingdom);
    const options = filteredSpecies.map(({ species }) => species);
    setSpeciesOptions(options);

    // Reset species filter if no match is found
    if (
      filters.kingdom.length > 0 &&
      filters.species.length > 0 &&
      !options.find((option) => filters.species === option)
    ) {
      setFilters((prevValue) => ({ ...prevValue, species: '' }));
    }
  }, [species, filters]);

  useEffect(() => {
    const { kingdom, species: speciesFilter, all } = filters;

    const filteredSpecies = species.filter((item) => {
      let freeTextSearchHit = false;

      for (const [key, value] of Object.entries(item)) {
        if (typeof value !== 'string') continue;

        if (
          (key === 'kingdom' && kingdom && kingdom !== value) ||
          (key === 'species' && speciesFilter && speciesFilter !== value)
        ) {
          return false;
        }

        if (all && value.toLowerCase().includes(all)) {
          freeTextSearchHit = true;
        }
      }

      return all === '' || freeTextSearchHit;
    });

    setItems(filteredSpecies.sort(createCompareFn(sort)));
  }, [species, filters, sort, setItems]);

  if (!images) return null;

  const handleFilterChange = (id: string, value: string) => {
    setFilters((prevValue) => ({ ...prevValue, [id]: value }));
  };

  return (
    <form>
      <div className="grid">
        <label htmlFor="kingdom">
          Klass
          <input
            id="kingdom"
            value={filters.kingdom || ''}
            list="kingdoms-data"
            autoComplete="off"
            size={2}
            onChange={(e) => handleFilterChange(e.target.id, e.target.value)}
          />
          <datalist id="kingdoms-data">{toDatalistOptions(species.map(({ kingdom }) => kingdom))}</datalist>
        </label>

        <label htmlFor="species">
          Art
          <input
            id="species"
            value={filters.species || ''}
            list="species-data"
            autoComplete="off"
            onChange={(e) => handleFilterChange(e.target.id, e.target.value)}
          />
          <datalist id="species-data">{toDatalistOptions(speciesOptions)}</datalist>
        </label>

        <label htmlFor="all">
          Fritextsökning
          <input id="all" onChange={(e) => handleFilterChange(e.target.id, e.target.value)} />
        </label>
      </div>
    </form>
  );
}
