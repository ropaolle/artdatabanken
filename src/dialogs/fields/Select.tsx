import classes from './fields.module.css';
import { type FieldError, type UseFormRegister, type FieldValues, type Path } from 'react-hook-form';
import { toOptions, type Option } from '../../lib/options';

type Props<Inputs extends FieldValues> = {
  id: Path<Inputs>;
  label: string;
  options: Option[];
  error?: FieldError;
  required?: boolean | string;
  register: UseFormRegister<Inputs>;
};

export default function Select<Inputs extends FieldValues>({
  id,
  label,
  options,
  error,
  register,
  required = false,
}: Props<Inputs>) {
  return (
    <label htmlFor={id}>
      {label}
      <select id={id} {...register(id, { required })}>
        {toOptions(options)}
      </select>
      {error && error.type === 'required' && <div className={classes.error}>{error.message}</div>}
    </label>
  );
}
