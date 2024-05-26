/* eslint-disable */

import React from 'react';
import image404 from '../images/404-image.png';

const Page404 = () => {
  return (
    <div class="text-center">
      <img alt="Страница не найдена"
      className="img-fluid h-25"
      src={image404}
      />
      <h1 class="h4 text-muted">Страница не найдена</h1>
      <p class="text-muted">Но вы можете перейти <a href="/">на главную страницу</a></p>
    </div>
  )
};

export default Page404;