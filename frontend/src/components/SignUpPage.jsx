import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import routes from '../routes';
import signUpImage from '../images/signup-image.jpg';
import {
  setToken,
  logIn,
  logOut,
  setShowNotifyNetworkError,
  getShowNotifyNetworkError,
  setShowNotifyServerError,
  getShowNotifyServerError,
} from '../slices/authorizationSlice';
import notifyError from '../utils/notifyError';
import 'react-toastify/dist/ReactToastify.css';

const SignUpPage = () => {
  const [nameError, setShowNameError] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const schema = yup.object().shape({
    username: yup
      .string()
      .required(t('errors.notBeEmpty'))
      .min(3, t('errors.min3'))
      .max(20, t('errors.max20')),
    password: yup
      .string()
      .required(t('errors.notBeEmpty'))
      .min(6, t('errors.min6')),
    confirmPassword: yup
      .string()
      .required('Обязательное поле')
      .oneOf([yup.ref('password'), null], t('errors.passwordsMustMatch')),
  });

  const isShowNotifyNetworkError = useSelector(getShowNotifyNetworkError);
  const isShowNotifyServerError = useSelector(getShowNotifyServerError);

  const handleSubmit = async (formValue) => {
    try {
      const response = await axios.post(routes.signUpPath(), {
        username: formValue.username,
        password: formValue.password,
      });
      // const tokenValueInStorage = localStorage.getItem('token');

      if (response.data) {
        const { token } = response.data;
        if (localStorage.getItem('token')) {
          localStorage.removeItem('token');
          dispatch(logOut());
        }
        localStorage.setItem('token', token);
        dispatch(setToken(token));
        dispatch(logIn(response.data.username));
        setShowNameError(false);
        navigate('/');
      } else {
        setShowNameError(true);
        navigate('/signup');
      }
    } catch (error) {
      if (error.response.status === 409) {
        setShowNameError(true);
      }
      if (error.code === 'ERR_NETWORK') {
        dispatch(setShowNotifyNetworkError());
      }
      if (error.response.status >= 500) {
        dispatch(setShowNotifyServerError());
      }
      console.log(error);
    }
  };

  useEffect(() => {
    if (isShowNotifyNetworkError) {
      notifyError(t('errors.notifyNetworkError'));
      dispatch(setShowNotifyNetworkError());
    }
  }, [isShowNotifyNetworkError, dispatch, t]);

  useEffect(() => {
    if (isShowNotifyServerError) {
      notifyError(t('errors.notifyServerError'));
      dispatch(setShowNotifyServerError());
    }
  }, [isShowNotifyServerError, dispatch, t]);

  const formInit = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: schema,
    onSubmit: (values) => handleSubmit(values),
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
          <div className="col-12 col-md-6 col-xxl-6">
            <div className="card shadow-sm">
              <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
                <div>
                  <img src={signUpImage} className="rounded-circle" alt={t('signUpPage.header')} />
                </div>
                <div className="col-12 col-md-6">
                  <Form onSubmit={formInit.handleSubmit}>
                    <h1 className="text-center mb-4">{t('signUpPage.header')}</h1>
                    <Form.Group className="mb-3">
                      <Form.Control
                        name="username"
                        type="text"
                        placeholder={t('signUpPage.yourNickname')}
                        autoComplete="username"
                        id="username"
                        onChange={formInit.handleChange}
                        onBlur={formInit.handleBlur}
                        value={formInit.values.username}
                        isInvalid={formInit.touched.username && (!!formInit.errors.username)}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formInit.errors.username}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Control
                        name="password"
                        type="password"
                        placeholder={t('signUpPage.yourPassword')}
                        id="password"
                        autoComplete="password"
                        onChange={formInit.handleChange}
                        onBlur={formInit.handleBlur}
                        value={formInit.values.password}
                        isInvalid={formInit.touched.password && (!!formInit.errors.password)}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formInit.errors.password}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Control
                        name="confirmPassword"
                        type="password"
                        placeholder={t('signUpPage.confirmYourPassword')}
                        id="confirmPassword"
                        autoComplete="confirmPassword"
                        onChange={formInit.handleChange}
                        onBlur={formInit.handleBlur}
                        value={formInit.values.confirmPassword}
                        isInvalid={formInit.touched.confirmPassword
                          && (!!formInit.errors.confirmPassword)}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formInit.errors.confirmPassword}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Button type="submit">
                      {t('signUpPage.register')}
                    </Button>
                    {nameError && (
                    <div className="invalid-feedback" style={{ display: 'block', color: 'red' }}>{t('errors.userAlreadyExists')}</div>
                    )}
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
