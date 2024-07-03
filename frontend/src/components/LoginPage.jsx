/* eslint-disable */
import axios from 'axios';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import routes from '../routes.js';
import startImage from '../images/start-image.jpeg';
import * as yup from 'yup';
import { getUser, getIsAuthorization, getToken, setToken, setUser, logIn } from '../slices/authorizationSlice.js';
import { useSelector, useDispatch } from 'react-redux';

const handleSubmit = async (formValue, setShowError, navigate, dispatch) => {
  // Попытка отправить форму
  try {
    const response = await axios.post(routes.loginPath(), {
      username: formValue.username,
      password: formValue.password,
    });
    const token = response.data.token;
    dispatch(setToken(token));
    dispatch(logIn(response.data.username));
    console.log('token in LoginForm>>>', token);
    localStorage.setItem('token', token);
    const tokenValueInStorage = localStorage.getItem('token');
    
    if (tokenValueInStorage && tokenValueInStorage.length > 0) {
      setShowError(false);
      navigate('/');
    } else {
      setShowError(true);
      navigate('/login');
    }
  }
  catch (e) {
    console.log(e);
    setShowError(true);
  }
};

export const LoginPage = () => {

  //const authInit = useAuth();
  //console.log('authInit>>>', authInit);
  const { t } = useTranslation();
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
  return (
    <div className="d-flex flex-column h-100">
      <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
        <div className="container">
          <a className="navbar-brand" href="/">{t('headerChat.header')}</a>
        </div>
      </nav>
  
      <div className="container-fluid h-100">
        <div className="row justify-content-center align-content-center h-100">
          <div className="col-12 col-md-6">
            <div className="card shadow-sm">
              <div className="card-body row p-5">
                <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                  <img src={startImage} className="rounded-circle" alt={t('loginPage.header')}></img>
                </div>
                <div className="col-12 col-md-6">
                <Form onSubmit={formInit.handleSubmit}>
                    <h1 className="text-center mb-4">{t('loginPage.header')}</h1>
                    <Form.Group className="mb-3">
                      <Form.Control type="text"
                        placeholder={t('loginPage.yourNickname')}
                        autoComplete="username"
                        id="username"
                        onChange={formInit.handleChange}
                        onBlur={formInit.handleBlur}
                        value={formInit.values.username} />
                    </Form.Group>
                    <Form.Group className="mb-3" >
                      <Form.Control type="password"
                        placeholder={(t('loginPage.yourPassword'))}
                        id="password"
                        autoComplete="password"
                        onChange={formInit.handleChange}
                        onBlur={formInit.handleBlur}
                        value={formInit.values.password} />
                        {showError && (
                          <div className="invalid-feedback" style={{ display: 'block', color: 'red' }}>{t('errors.incorrectNameOrPassword')}</div>
                        )}
                    </Form.Group>
  
                    <Button type="submit">
                      Войти
                    </Button>
                  </Form>
                  </div>
                </div>
                  <div className="card-footer p-4">
                        <div className="text-center">
                          <span>{t('loginPage.hasNoAccount')}</span>
                            <a href="/signup">{t('loginPage.registration')}</a>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
