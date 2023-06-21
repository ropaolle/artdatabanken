import { useState } from 'react';
// import './App.css';
import { Navigation, ImageView, UploadImage, Footer } from './components';
import { useForm, SubmitHandler } from 'react-hook-form';

type Inputs = {
  example: string;
  exampleRequired: string;
};

function App() {
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data, a) => console.log(data, a);

  // console.log(watch('example')); // watch input value by passing the name of it

  return (
    <>
      <Navigation show={() => setShowUploadDialog(true)} />
      <UploadImage open={showUploadDialog} show={setShowUploadDialog} />
      <main className="container">
        <h1>Sidgenerator</h1>
        {/* <h2>Bilder</h2> */}
        {/* <ImageView /> */}
        {/* <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
          <img src={'image516.jpg'} />
        </ReactCrop> */}
        <h2>React hook form</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* register your input into the hook by invoking the "register" function */}
          <input defaultValue="test" {...register('example')} />

          {/* include validation with required or other standard HTML validation rules */}
          <input {...register('exampleRequired', { required: true })} />
          {/* errors will return when field validation fails  */}
          {errors.exampleRequired && <span>This field is required</span>}

          <input type="submit" />
          <input type="submit" />
        </form>
      </main>
      <Footer />
    </>
  );
}

export default App;
