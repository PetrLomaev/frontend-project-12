import axios from 'axios';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { Button, Form, FloatingLabel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { serverRoutes, pageRoutes } from '../routes';
import startImage from '../images/start-image.jpeg';
import { logIn, logOut, getIsAuthorization } from '../slices/authorizationSlice';
import { notifyError } from '../utils/notifyError';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
  const { t } = useTranslation();
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (formValue) => {
    try {
      const response = await axios.post(serverRoutes.loginPath(), {
        username: formValue.username,
        password: formValue.password,
      });
      if (response.data) {
        const { token, username } = response.data;
        dispatch(logIn({ token, username }));
        const tokenValueInStorage = localStorage.getItem('token');
        if (tokenValueInStorage && tokenValueInStorage.length > 0) {
          setShowError(false);
          navigate(pageRoutes.home);
        }
      } else {
        setShowError(true);
        navigate(pageRoutes.login);
      }
    } catch (error) {
      console.log(error);
      if (error.code === 'ERR_NETWORK') {
        notifyError(t('errors.notifyNetworkError'));
      }
      if (error.response.status >= 500) {
        notifyError(t('errors.notifyServerError'));
      }
      setShowError(true);
    }
  };

  const isAuthorization = useSelector(getIsAuthorization);

  const schema = yup.object().shape({
    username: yup.string().required(t('errors.requiredField')),
    password: yup.string().required(t('errors.requiredField')),
  });

  const formInit = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: schema,
    onSubmit: (values) => handleSubmit(values, setShowError, navigate, dispatch),
  });

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

      <div className="container-fluid h-100">
        <div className="row justify-content-center align-content-center h-100">
          <div className="col-12 col-md-6">
            <div className="card shadow-sm">
              <div className="card-body row p-5">
                <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                  <img src={startImage} className="rounded-circle" alt={t('loginPage.header')} />
                </div>
                <Form className="col-12 col-md-6 mt-3 mt-mb-0" onSubmit={formInit.handleSubmit}>
                  <h1 className="text-center mb-4">{t('loginPage.header')}</h1>
                  <Form.Group className="form-floating mb-3">
                    <FloatingLabel
                      controlId="username"
                      label={t('loginPage.yourNickname')}
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        placeholder={t('loginPage.yourNickname')}
                        autoComplete="username"
                        required
                        onChange={formInit.handleChange}
                        onBlur={formInit.handleBlur}
                        value={formInit.values.username}
                        autoFocus
                        isInvalid={formInit.touched.username && (!!formInit.errors.username)}
                      />
                    </FloatingLabel>
                  </Form.Group>
                  <Form.Group className="form-floating mb-4">
                    <FloatingLabel
                      controlId="password"
                      label={t('loginPage.yourPassword')}
                      className="mb-3"
                    >
                      <Form.Control
                        type="password"
                        placeholder={(t('loginPage.yourPassword'))}
                        autoComplete="password"
                        required
                        onChange={formInit.handleChange}
                        onBlur={formInit.handleBlur}
                        value={formInit.values.password}
                        isInvalid={formInit.touched.password && (!!formInit.errors.password)}
                      />
                    </FloatingLabel>
                  </Form.Group>
                  <Button type="submit" className="w-100 mb-3 btn">
                    Войти
                  </Button>
                  {showError && (
                  <div className="invalid-feedback" style={{ display: 'block', color: 'red' }}>{t('errors.incorrectNameOrPassword')}</div>
                  )}
                </Form>
              </div>
              <div className="card-footer p-4">
                <div className="text-center">
                  <span>{t('loginPage.hasNoAccount')}</span>
                  <a href={pageRoutes.signUp}>{t('loginPage.registration')}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
