import classes from './Collections.module.css';
import { useState, useEffect } from 'react';
import Page from '../Page';
import A4Page from './A4Page';
import { useAppStore } from '../../state';
import { toDatalistOptions } from '../../lib/options';

const sortOnLatinName = (a: SpeciesInfo, b: SpeciesInfo) => {
  if (a.speciesLatin < b.speciesLatin) {
    return -1;
  }
  if (a.speciesLatin > b.speciesLatin) {
    return 1;
  }
  return 0;
};

const spliceIntoChunks = (items: SpeciesInfo[], chunkSize: number) => {
  const res = [];
  while (items.length > 0) {
    const chunk = items.splice(0, chunkSize);
    res.push(chunk);
  }
  return res;
};

export default function Collections({ defaultFamily }: { defaultFamily?: string }) {
  const { species } = useAppStore();

  const [items, setItems] = useState<SpeciesInfo[][]>([]);
  const [family, setFamily] = useState(defaultFamily);

  useEffect(() => {
    const items = family ? species.sort(sortOnLatinName).filter((item) => item.family === family) : [];
    setItems(spliceIntoChunks(items, 9));
  }, [species, family]);

  const Pages = ({ items }: { items: SpeciesInfo[][] }) =>
    items && items.map((species, i) => <A4Page key={i} page={i} items={species} />);

  return (
    <Page
      id="collections"
      title="Samlingar"
      headerButtonTitle="Skriv ut"
      onHeaderButtonClick={() => print()}
      headerButtonDisabled={!family}
    >
      <div id="filter" className={classes.filter}>
        <label htmlFor="family">
          Familj
          <input
            id="family"
            value={family}
            list="family-data"
            autoComplete="off"
            onChange={(e) => setFamily(e.target.value)}
          />
          <datalist id="family-data">{toDatalistOptions(species.map(({ family }) => family))}</datalist>
        </label>

        <h3>Förhandsvisning</h3>
      </div>

      <Pages items={items} />
    </Page>
  );
}
