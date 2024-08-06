import React from 'react';
import i18next from 'i18next';
import { io } from 'socket.io-client';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import Rollbar from 'rollbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { Provider } from 'react-redux';
import SocketProvider from './providers/socketProvider.js';
import resources from './locales/index.js';
import store from './slices/configureStore';

const rollbarInit = {
  accessToken: '206a4d562e91496ea0a8654923663f9c',
  environment: 'testenv',
};

const rollbarConfig = new Rollbar(rollbarInit);

const Init = ({ children }) => {
  i18next
    .use(initReactI18next)
    .init({
      resources,
      debug: true,
      fallbackLng: 'ru',
      interpolation: {
        escapeValue: false,
      },
    });

  const newSocket = io();

  return (
    <I18nextProvider i18n={i18next} defaultNS="translation">
      <RollbarProvider config={rollbarConfig}>
        <ErrorBoundary>
          <Provider store={store}>
            <SocketProvider newSocket={newSocket}>
              {children}
              <ToastContainer />
            </SocketProvider>
          </Provider>
        </ErrorBoundary>
      </RollbarProvider>
    </I18nextProvider>
  );
};

export default Init;
