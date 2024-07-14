/* eslint-disable react/react-in-jsx-scope */
import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import SignUpPage from './components/SignUpPage';
import Page404 from './components/Page404';
import store from './slices/configureStore';
import 'bootstrap/dist/css/bootstrap.min.css';
import './i18next';
import 'react-toastify/dist/ReactToastify.css';

const App = () => (
  <div className="App">
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </Provider>
  </div>
);

export default App;
