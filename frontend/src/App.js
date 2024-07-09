/* eslint-disable */

//import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from './components/LoginPage';
import { HomePage } from './components/HomePage';
import { SignUpPage } from './components/SignUpPage';
import Page404 from './components/Page404';
import store from '../src/slices/configureStore';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import './i18next';

const App = () => {

  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="*" element={<Page404 />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;

/*
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit
          {' '}
          <code>src/App.js</code>
          {' '}
          and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
*/