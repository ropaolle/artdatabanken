export type Option = {
  value: string;
  label: string;
  alternativeLabel?: string;
};

export const toOptions = (options: Option[]) =>
  options.map(({ value, label, alternativeLabel }) => (
    <option key={value} value={value}>
      {label}
      {alternativeLabel && ` (${alternativeLabel})`}
    </option>
  ));

export const toDatalistOptions = (items: string[] | Set<string>) =>
  Array.from(items).map((option, i) => <option key={i}>{option}</option>);

export const counties = [
  { value: '', label: 'Ange län…' },
  { value: 'uppland', label: 'Uppland' },
  { value: 'stockholm', label: 'Stockholms län' },
  { value: 'uppsala', label: 'Uppsala län' },
  { value: 'sodermanland', label: 'Södermanlands län', alternativeLabel: 'Sörmlands län' },
  { value: 'ostergotland', label: 'Östergötlands län' },
  { value: 'jonkoping', label: 'Jönköpings län' },
  { value: 'kronoberg', label: 'Kronobergs län' },
  { value: 'kalmar', label: 'Kalmar län', alternativeLabel: 'Ölands län' },
  { value: 'gotland', label: 'Gotlands län' },
  { value: 'blekinge', label: 'Blekinge län' },
  { value: 'skane', label: 'Skåne län' },
  { value: 'halland', label: 'Hallands län' },
  { value: 'vastra-gotaland', label: 'Västra Götalands län' },
  { value: 'varmland', label: 'Värmlands län' },
  { value: 'orebro', label: 'Örebro län' },
  { value: 'vastmanland', label: 'Västmanlands län' },
  { value: 'dalarna', label: 'Dalarnas län' },
  { value: 'gavleborg', label: 'Gävleborgs län' },
  { value: 'vasternorrland', label: 'Västernorrlands län' },
  { value: 'jamtland', label: 'Jämtlands län' },
  { value: 'vasterbotten', label: 'Västerbottens län', alternativeLabel: 'Lapplands län' },
  { value: 'norrbotten', label: 'Norrbottens län' },
];

export const sexes = [
  { value: '', label: 'Ange kön…' },
  { value: 'male', label: 'Hane' },
  { value: 'female', label: 'Hona' },
  { value: 'maleAndFemale', label: 'Hane/Hona' },
];

const getMap = (data: Option[]) => {
  const map = new Map();

  for (const { value, label } of data) {
    if (value === '') continue;
    map.set(value, label);
  }

  return map;
};

export const countiesMap = getMap(counties);
export const sexesMap = getMap(sexes);
