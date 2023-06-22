import { useForm, SubmitHandler } from 'react-hook-form';

type Inputs = {
  speices: string;
  place: string;
  date: string;
  kingdom: string;
  order: string;
  family: string;
  county: string;
  speicesLatin: string;
  sex: string;
};

export default function SpeicesView() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      speices: 'dusmmy',
      place: '',
      date: new Date().toLocaleDateString(),
      kingdom: '',
      order: '',
      family: '',
      county: '',
      speicesLatin: '',
      sex: '',
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  // console.log(watch('example'));

  const counties = [
    { value: '', text: 'Ange län…' },
    { value: 'stockholm', text: 'Stockholms län' },
    { value: 'uppsala', text: 'Uppsala län' },
    { value: 'sodermanland', text: 'Södermanlands län' },
    { value: 'ostergotland', text: 'Östergötlands län' },
    { value: 'jonkoping', text: 'Jönköpings län' },
    { value: 'kronoberg', text: 'Kronobergs län' },
    { value: 'kalmar', text: 'Kalmar län' },
    { value: 'gotland', text: 'Gotlands län' },
    { value: 'blekinge', text: 'Blekinge län' },
    { value: 'skane', text: 'Skåne län' },
    { value: 'halland', text: 'Hallands län' },
    { value: 'vastra-gotaland', text: 'Västra Götalands län' },
    { value: 'varmland', text: 'Värmlands län' },
    { value: 'orebro', text: 'Örebro län' },
    { value: 'vastmanland', text: 'Västmanlands län' },
    { value: 'dalarna', text: 'Dalarnas län' },
    { value: 'gavleborg', text: 'Gävleborgs län' },
    { value: 'vasternorrland', text: 'Västernorrlands län' },
    { value: 'jamtland', text: 'Jämtlands län' },
    { value: 'vasterbotten', text: 'Västerbottens län' },
    { value: 'norrbotten', text: 'Norrbottens län' },
  ];

  const countyOptions = counties.map(({ value, text }) => (
    <option key={value} value={value}>
      {text}
    </option>
  ));
  const sexes = [
    { value: '', text: 'Ange kön…' },
    { value: 'male', text: 'Hane' },
    { value: 'female', text: 'Hona' },
  ];

  const sexOptions = sexes.map(({ value, text }) => (
    <option key={value} value={value}>
      {text}
    </option>
  ));

  /*
image "image067.jpg"
*/

  return (
    <div className="speices-view">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid">
          <label htmlFor="speices">
            Art*
            <input {...register('speices') /* , { required: true } */} />
            {/* {errors.exampleRequired && <span>This field is required</span>} */}
          </label>

          <label htmlFor="family">
            Familj*
            <input {...register('family') /* , { required: true } */} />
          </label>

          <label htmlFor="date">
            Datum
            <input type="date" {...register('date')} />
          </label>
        </div>

        <div className="grid">
          <label htmlFor="kingdom">
            Klass
            <input {...register('kingdom')} />
          </label>

          <label htmlFor="order">
            Ordning
            <input {...register('order')} />
          </label>

          <label htmlFor="sex">
            Kön
            <select {...register('sex')}>{sexOptions}</select>
          </label>
        </div>

        <div className="grid">
          <label htmlFor="county">
            Län
            <select {...register('county')}>{countyOptions}</select>
          </label>

          <label htmlFor="place">
            Lokal
            <input {...register('place')} />
          </label>

          <label htmlFor="speicesLatin">
            Latinskt namn
            <input {...register('speicesLatin')} />
          </label>
        </div>

        <input type="submit" />
      </form>
    </div>
  );
}
