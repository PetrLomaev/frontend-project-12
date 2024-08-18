import React from 'react';
import { useTranslation } from 'react-i18next';
import image404 from '../images/404-image.png';
import { pageRoutes } from '../routes';

const Page404 = () => {
  const { t } = useTranslation();

  return (
    <div className="d-flex flex-column h-100">
      <div className="text-center">
        <img alt={t('page404.header')} className="img-fluid w-25" src={image404} />
        <h1 className="h4 text-muted">{t('page404.header')}</h1>
        <p className="text-muted">
          {t('page404.youCanGo')}
          <a href={pageRoutes.home}>
            {t('page404.onMainPage')}
          </a>
        </p>
      </div>
    </div>
  );
};

export default Page404;
