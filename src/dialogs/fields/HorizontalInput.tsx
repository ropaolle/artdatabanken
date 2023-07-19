import classes from './fields.module.css';
import { type FieldError, type UseFormRegister, type FieldValues, type Path } from 'react-hook-form';
import { toDatalistOptions } from '../../lib/options';

type Props<Inputs extends FieldValues> = {
  id: Path<Inputs>;
  label: string;
  dataList?: string[];
  error?: FieldError;
  required?: boolean | string;
  register: UseFormRegister<Inputs>;
};

export default function HorizontalInput<Inputs extends FieldValues>({
  id,
  label,
  dataList,
  error,
  register,
  required = false,
}: Props<Inputs>) {
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <div>
        <input id={id} list={`${id}-data`} autoComplete="off" {...register(id, { required })} />
        {dataList && (
          <datalist id={`${id}-data`} className={classes.dataList}>
            {toDatalistOptions(dataList)}
          </datalist>
        )}
        {error && error.type === 'required' && <div className={classes.error}>{error.message}</div>}
      </div>
    </>
  );
}
