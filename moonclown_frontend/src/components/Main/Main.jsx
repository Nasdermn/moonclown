import Header from '../Header/Header.jsx';
import Moonclown from '../Moonclown/Moonclown.jsx';
import Heartrate from '../Heartrate/Heartrate.jsx';
import Footer from '../Footer/Footer.jsx';

function Main() {
  return (
    <div className='body'>
      <Header />
      <main className='main'>
        <Moonclown />
        <Heartrate />
      </main>
      <Footer />
    </div>
  );
}

export default Main;
