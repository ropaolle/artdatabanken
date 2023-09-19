import classes from './Collections.module.css';
import placeholder from '../../assets/placeholder.svg';
import { countiesMap } from '../../lib/options';
import { useAppStore } from '../../state';
import { Icon } from '@iconify/react';

// Combine multiple CSS module selectors
const css = (...selectors: string[]) => selectors.map((selector) => classes[selector]).join(' ');

type Props = {
  items?: SpeciesInfo[];
  page?: number;
};

export default function A4Page({ items }: Props) {
  const { images } = useAppStore();

  const getImage = (name: string) => images.find((image) => image.filename === name)?.URL || placeholder;

  const Cards = () =>
    items &&
    items.map(({ id, image, species, speciesLatin, place, county, date, sex }) => (
      <div key={id} className={classes.card}>
        <div>
          <img src={getImage(image)} alt={image} />
        </div>

        <div className={`collection-body ${classes.body}`}>
          <b>{species}</b>
          {speciesLatin && <> ({speciesLatin}) </>}
          {['male', 'maleAndFemale'].includes(sex) && (
            <Icon inline className={classes.genderIcon} icon="material-symbols:male" />
          )}
          {['female', 'maleAndFemale'].includes(sex) && (
            <Icon inline className={classes.genderIcon} icon="material-symbols:female" />
          )}
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
      <div className={classes.header}>
        Klass: <span className={css('headerOption', 'headerInverse')}>{items[0].kingdom}</span>
        Ordning: <span className={classes.headerOption}>{items[0].order}</span>
        Familj: <span className={classes.headerOption}>{items[0].family}</span>
      </div>
      <div className={classes.grid}>
        <Cards />
      </div>
    </div>
  );
}
