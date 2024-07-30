import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { logOut, getIsAuthorization } from '../slices/authorizationSlice';
import image404 from '../images/404-image.png';

const Page404 = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const isAuthorization = useSelector(getIsAuthorization);

  const handleLogOut = () => {
    dispatch(logOut());
  };

  return (
    <div className="d-flex flex-column h-100">
      <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
        <div className="container">
          <a className="navbar-brand" href="/">
            {t('headerChat.header')}
          </a>
          {isAuthorization && (
          <button type="button" className="btn btn-primary" onClick={handleLogOut}>
            {t('homePage.exitButton')}
          </button>
          )}
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
