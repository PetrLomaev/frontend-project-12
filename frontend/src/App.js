/* eslint-disable react/react-in-jsx-scope */
import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import SignUpPage from './components/SignUpPage';
import Page404 from './components/Page404';
import { pageRoutes } from './routes';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

const App = () => (
  <div className="App">
    <BrowserRouter>
      <Routes>
        <Route path={pageRoutes.login} element={<LoginPage />} />
        <Route path={pageRoutes.home} element={<HomePage />} />
        <Route path={pageRoutes.signUp} element={<SignUpPage />} />
        <Route path={pageRoutes.page404} element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  </div>
);

export default App;
