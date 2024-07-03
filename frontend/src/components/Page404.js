/* eslint-disable */

import React from 'react';
import image404 from '../images/404-image.png';
import { useTranslation } from 'react-i18next';

const Page404 = () => {
  const { t } = useTranslation();
  return (
    <div class="text-center">
      <img alt={t('page404.header')}
      className="img-fluid h-25"
      src={image404}
      />
      <h1 class="h4 text-muted">{t('page404.header')}</h1>
      <p class="text-muted">{t('page404.youCanGo')}<a href="/">{t('page404.onMainPage')}</a></p>
    </div>
  )
};

export default Page404;