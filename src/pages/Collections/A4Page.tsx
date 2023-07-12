import classes from './Collections.module.css';
import { useStoreState } from '../../state';
import { SpeciesInfo } from '../../lib/firebase';
import placeholder from '../../assets/placeholder.svg';
import { countiesMap } from '../../lib/options';

// Combine multiple CSS module selectors
const css = (...selectors: string[]) => selectors.map((selector) => classes[selector]).join(' ');

type Props = {
  items: SpeciesInfo[] | undefined;
  page?: number;
};

export default function A4Page({ items }: Props) {
  const images = useStoreState('images');

  // TODO: is this too slow, i.e. loops all images?
  const getImage = (name: string) => images.find((image) => image.filename === name)?.URL || placeholder;

  const Cards = () =>
    items &&
    items.map(({ id, image, species, speciesLatin, place, county, date }) => (
      <div key={id} className={classes.card}>
        <div>
          <img src={getImage(image)} alt={image} />
        </div>

        <div className={`collection-body ${classes.body}`}>
          <b>{species}</b>
          {speciesLatin && <> ({speciesLatin}) </>}
        </div>

        <div className={`collection-footer ${classes.footer}`}>
          <span>
            {place} ({countiesMap.get(county)?.replace('s län', '').replace(' län', '')})
          </span>
          <span>{date}</span>
        </div>
      </div>
    ));

  if (!items || items.length === 0) return null;

  return (
    <div className={classes.collection} id="collection">
      <div className={classes.header} /* id="header" */>
        Klass: <span className={css('headerOption', 'headerInverse')}>{items[0].kingdom}</span>
        Ordning: <span className={classes.headerOption}>{items[0].order}</span>
        Familj: <span className={classes.headerOption}>{items[0].family}</span>
      </div>
      <div className={classes.grid} /* id="grid" */>
        <Cards />
      </div>
    </div>
  );
}