import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store/store';
import './index.scss';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const pageElement = document.getElementById('page');
if (pageElement) {
  const page = ReactDOM.createRoot(pageElement);
  page.render(
    <BrowserRouter basename='/moonclown'>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>,
  );
} else {
  console.error("Элемент с id 'page' не найден в DOM!");
}
