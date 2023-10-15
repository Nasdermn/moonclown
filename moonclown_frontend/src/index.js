import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store/store';
import './index.css';
import App from './components/App/App.jsx';
import { BrowserRouter } from 'react-router-dom';

const page = ReactDOM.createRoot(document.getElementById('page'));
page.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
);
