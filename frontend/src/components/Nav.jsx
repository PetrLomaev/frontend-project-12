import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { logOut, getIsAuthorization } from '../slices/authorizationSlice';
import { pageRoutes } from '../routes';

const Nav = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isAuthorization = useSelector(getIsAuthorization);

  const handleLinkClick = (e) => {
    if (isAuthorization) {
      e.preventDefault();
    } else {
      navigate(pageRoutes.home);
    }
  };

  const handleLogOut = () => {
    dispatch(logOut());
  };

  return (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container">
        <a className="navbar-brand" href={pageRoutes.home} onClick={handleLinkClick}>
          {t('headerChat.header')}
        </a>
        {isAuthorization && (
          <button type="button" className="btn btn-primary" onClick={handleLogOut}>
            {t('homePage.exitButton')}
          </button>
        )}
      </div>
    </nav>
  );
};

export default Nav;
