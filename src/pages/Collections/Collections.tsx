import classes from './Collections.module.css';
import { useState, useEffect } from 'react';
import { useStoreState } from '../../state';
import { SpeciesInfo } from '../../lib/firebase';
import Page from '../Page';
import A4Page from './A4Page';

const spliceIntoChunks = (items: SpeciesInfo[], chunkSize: number) => {
  const res = [];
  while (items.length > 0) {
    const chunk = items.splice(0, chunkSize);
    res.push(chunk);
  }
  return res;
};

export default function Collections() {
  const species = useStoreState('species');
  const dataLists = useStoreState('dataLists');
  const [items, setItems] = useState<SpeciesInfo[][]>();
  const [family, setFamily] = useState('');

  useEffect(() => {
    const items = family ? species.filter((item) => item.family === family) : [];
    setItems(spliceIntoChunks(items, 9));
  }, [species, family]);

  const toOptions = (list: Set<string>) =>
    Array.from(list).map((value) => (
      <option key={value} value={value}>
        {value}
      </option>
    ));

  const Pages = ({ items }: { items: SpeciesInfo[][] }) =>
    items && items.map((species, i) => <A4Page key={i} page={i} items={species} />);

  return (
    <Page id="collections" title="Samlingar" headerButtonTitle="Skriv ut" onHeaderButtonClick={() => print()}>
      <div id="filter" className={classes.filter}>
        <label htmlFor="family">
          Familj
          <input id="family" list="family-data" autoComplete="off" onChange={(e) => setFamily(e.target.value)} />
          <datalist id="family-data">{toOptions(dataLists.families)}</datalist>
        </label>

        <h3>Förhandsvisning</h3>
      </div>

      <Pages items={items || []} />
    </Page>
  );
}
