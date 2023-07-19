import classes from './fields.module.css';
import { type FieldError, type UseFormRegister, type FieldValues, type Path } from 'react-hook-form';

type Props<Inputs extends FieldValues> = {
  id: Path<Inputs>;
  label: string;
  error?: FieldError;
  required?: boolean | string;
  register: UseFormRegister<Inputs>;
  type: string;
};

export default function Input<Inputs extends FieldValues>({
  id,
  label,
  error,
  register,
  required = false,
  ...rest
}: Props<Inputs>) {
  return (
    <label htmlFor={id}>
      {label}
      <input id={id} {...register(id, { required })} {...rest} />
      {error && error.type === 'required' && <div className={classes.error}>{error.message}</div>}
    </label>
  );
}
