import './App.css';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import UploadImage from './components/UploadImage.tsx';

function App() {
  return (
    <>
      <Header />
      <main className="container">
        <h1>Artdatabanken 2023</h1>
        <UploadImage />
      </main>
      <Footer />
    </>
  );
}

export default App;
