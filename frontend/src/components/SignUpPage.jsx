import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { Button, Form, FloatingLabel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import routes from '../routes';
import signUpImage from '../images/signup-image.jpg';
import {
  logIn,
  logOut,
  getIsAuthorization,
  setShowNotifyNetworkError,
  getShowNotifyNetworkError,
  setShowNotifyServerError,
  getShowNotifyServerError,
} from '../slices/authorizationSlice';
import { notifyError } from '../utils/notifyError';
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

  const isAuthorization = useSelector(getIsAuthorization);
  const isShowNotifyNetworkError = useSelector(getShowNotifyNetworkError);
  const isShowNotifyServerError = useSelector(getShowNotifyServerError);

  const handleSubmit = async (formValue) => {
    try {
      const response = await axios.post(routes.signUpPath(), {
        username: formValue.username,
        password: formValue.password,
      });

      if (response.data) {
        const { token, username } = response.data;
        if (localStorage.getItem('token')) {
          dispatch(logOut());
        }
        dispatch(logIn({ token, username }));
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
          <div className="col-12 col-md-6 col-xxl-6">
            <div className="card shadow-sm">
              <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
                <div>
                  <img src={signUpImage} className="rounded-circle" alt={t('signUpPage.header')} />
                </div>

                <Form className="w-50" onSubmit={formInit.handleSubmit}>
                  <h1 className="text-center mb-4">{t('signUpPage.header')}</h1>
                  <Form.Group className="form-floating mb-3">
                    <FloatingLabel
                      controlId="username"
                      label={t('signUpPage.yourNickname')}
                      className="mb-3"
                    >
                      <Form.Control
                        name="username"
                        type="text"
                        placeholder={t('errors.min3')}
                        autoComplete="username"
                        required
                        onChange={formInit.handleChange}
                        onBlur={formInit.handleBlur}
                        value={formInit.values.username}
                        autoFocus
                        isInvalid={formInit.touched.username && (!!formInit.errors.username)}
                      />
                      <Form.Control.Feedback type="invalid" tooltip>
                        {formInit.errors.username}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Form.Group>
                  <Form.Group className="form-floating mb-3">
                    <FloatingLabel
                      controlId="password"
                      label={t('signUpPage.yourPassword')}
                      className="mb-3"
                    >
                      <Form.Control
                        name="password"
                        type="password"
                        placeholder={t('errors.min6')}
                        required
                        autoComplete="password"
                        onChange={formInit.handleChange}
                        onBlur={formInit.handleBlur}
                        value={formInit.values.password}
                        isInvalid={formInit.touched.password && (!!formInit.errors.password)}
                      />
                      <Form.Control.Feedback type="invalid" tooltip>
                        {formInit.errors.password}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Form.Group>
                  <Form.Group className="form-floating mb-4">
                    <FloatingLabel
                      controlId="confirmPassword"
                      label={t('signUpPage.confirmYourPassword')}
                      className="mb-3"
                    >
                      <Form.Control
                        name="confirmPassword"
                        type="password"
                        placeholder={t('errors.passwordsMustMatch')}
                        required
                        autoComplete="confirmPassword"
                        onChange={formInit.handleChange}
                        onBlur={formInit.handleBlur}
                        value={formInit.values.confirmPassword}
                        isInvalid={formInit.touched.confirmPassword
                          && (!!formInit.errors.confirmPassword)}
                      />
                    </FloatingLabel>
                    <Form.Control.Feedback type="invalid" tooltip placement="right">
                      {formInit.errors.confirmPassword}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Button type="submit" className="w-100 mb-3 btn">
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
  );
};

export default SignUpPage;
