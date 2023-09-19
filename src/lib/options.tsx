export type Option = {
  value: string;
  label?: string;
  alternativeLabel?: string;
};

export const toOptions = (options: Option[]) =>
  options.map(({ value, label, alternativeLabel }) => (
    <option key={value} value={value}>
      {label || value}
      {alternativeLabel && ` (${alternativeLabel})`}
    </option>
  ));

export const toDatalistOptions = (items: string[], onlyUnique = true) => {
  if (onlyUnique) {
    items = Array.from(new Set(items));
  }

  return items.sort().map((option, i) => <option key={i}>{option}</option>);
};

export const counties = [
  { value: '', label: 'Ange landskap…' },
  { value: 'blekinge', label: 'Blekinge' },
  { value: 'bohuslan', label: 'Bohuslän' },
  { value: 'dalarna', label: 'Dalarnas' },
  { value: 'dalsland', label: 'Dalsland' },
  { value: 'gotland', label: 'Gotland' },
  { value: 'gastrikland', label: 'Gästrikland' },
  { value: 'halland', label: 'Halland' },
  { value: 'halsingland', label: 'Hälsingland' },
  { value: 'harjedalen', label: 'Härjedalen' },
  { value: 'jamtland', label: 'Jämtland' },
  { value: 'lappland', label: 'Lappland' },
  { value: 'medelpad', label: 'Medelpad' },
  { value: 'norrbotten', label: 'Norrbotten' },
  { value: 'narke', label: 'Närke' },
  { value: 'skane', label: 'Skåne' },
  { value: 'jonkoping', label: 'Småland' },
  { value: 'sodermanland', label: 'Södermanland' },
  { value: 'uppland', label: 'Uppland' },
  { value: 'varmland', label: 'Värmlands' },
  { value: 'vasterbotten', label: 'Västerbotten' },
  { value: 'vastra-gotaland', label: 'Västergötland' },
  { value: 'vastmanland', label: 'Västmanland' },
  { value: 'angermanland', label: 'Ångermanland' },
  { value: 'kalmar', label: 'Öland' },
  { value: 'ostergotland', label: 'Östergötland' },
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
