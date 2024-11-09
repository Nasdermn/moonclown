import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const pageElement = document.getElementById('page');
if (pageElement) {
  const page = ReactDOM.createRoot(pageElement);
  page.render(
    <BrowserRouter basename="/moonclown">
      <App />
    </BrowserRouter>
  );
} else {
  console.error("Элемент с id 'page' не найден в DOM!");
}
