import React from 'react';
import { useTranslation } from 'react-i18next';
import image404 from '../images/404-image.png';

const Page404 = () => {
  const { t } = useTranslation();
  return (
    <div className="d-flex flex-column h-100">
      <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
        <div className="container">
          <a className="navbar-brand" href="/">
            {t('headerChat.header')}
          </a>
        </div>
      </nav>
      <div className="text-center">
        <img alt={t('page404.header')} className="img-fluid w-25" src={image404} />
        <h1 className="h4 text-muted">{t('page404.header')}</h1>
        <p className="text-muted">
          {t('page404.youCanGo')}
          <a href="/">
            {t('page404.onMainPage')}
          </a>
        </p>
      </div>
    </div>
  );
};

export default Page404;
