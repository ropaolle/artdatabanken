import { useDebounceEffect } from './useDebounceEffect';
import { drawImageOnCanvas } from './canvas';

export type Options = {
  value: string;
  label: string;
};

export const toOptions = (options: Options[]) =>
  options.map(({ value, label }) => (
    <option key={value} value={value}>
      {label}
    </option>
  ));

export const toDatalist = (options: string[]) => options.map((option, i) => <option key={i}>{option}</option>);

export { useDebounceEffect, drawImageOnCanvas };
