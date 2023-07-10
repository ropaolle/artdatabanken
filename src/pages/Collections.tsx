import classes from './Collections.module.css';
import { useState, useEffect } from 'react';
import { useStoreState } from '../state';
import { /* ImageInfo,  */ SpeciesInfo } from '../lib/firebase';
import placeholder from '../assets/placeholder.svg';
import Page from './Page';
import { collection } from 'firebase/firestore';
// import { toOptions2 } from '../lib';
// import { sexes } from '../lib/listData.ts';

// Combine multiple CSS module selectors
const css = (...selectors: string[]) => selectors.map(selector => classes[selector]).join(' ')

export default function Collections() {
  const species = useStoreState('species');
  const images = useStoreState('images');
  const dataLists = useStoreState('dataLists');
  const [items, setItems] = useState(species);
  const [family, setFamily] = useState('');

  useEffect(() => {
    if (!family) setItems([]);

    setItems(species.filter((item) => item.family === family));
  }, [species, family]);

  const toOptions = (list: Set<string>) =>
    Array.from(list).map((value) => (
      <option key={value} value={value}>
        {value}
      </option>
    ));

  const getImage = (name: string) => images.find((image) => image.filename === name)?.downloadURL || placeholder;

  const Cards = ({ species }: { species: SpeciesInfo[] }) =>
    species.map((item) => (
      <div key={item.id} className={classes.card}>
        <img src={getImage(item.image)} alt={item.image} />
        <div className={`collection-footer ${classes.footer}`}>
          <div className={classes.body}>
            <b>{item.species}</b>
            {item.speciesLatin && <> ({item.speciesLatin})</>}
          </div>

          <div className={classes.bottom}>
            <span>
              {item.place} ({item.county})
            </span>
            <span>{item.date}</span>
          </div>
        </div>
      </div>
    ));

  return (
    <Page id='collections' title="Samlingar" headerButtonTitle="Skriv ut" onHeaderButtonClick={() => print()}>
      <div id='filter' className={classes.filter}>
        <label htmlFor="sex">
          Familj
          <select onChange={(e) => setFamily(e.target.value)}>
            <option value="">Välj familj…</option>
            {toOptions(dataLists.families)}
            </select>
        </label>
        <h3>Förhandsvisning</h3>
      </div>

      {items && items.length > 0 && (
        <div className={classes.collection} id="collection">
          <div className={classes.header}>
            Klass: <span className={css('option', 'inverse')}>{items[0].kingdom}</span>
            Ordning: <span className={classes.option}>{items[0].order}</span>
            Familj: <span className={classes.option}>{items[0].family}</span>
          </div>
          <div className={classes.grid}>
            <Cards species={items} />
          </div>
        </div>
      )}
    </Page>
  );
}
