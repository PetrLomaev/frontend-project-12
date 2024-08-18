import axios from 'axios';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { Button, Form, FloatingLabel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import getSchema from '../utils/validation';
import { serverRoutes, pageRoutes } from '../routes';
import signUpImage from '../images/signup-image.jpg';
import { logIn, logOut } from '../slices/authorizationSlice';
import { notifyError } from '../utils/notifyError';
import 'react-toastify/dist/ReactToastify.css';

const SignUpPage = () => {
  const [nameError, setShowNameError] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleSubmit = async (formValue) => {
    try {
      const response = await axios.post(serverRoutes.signUpPath(), {
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
        navigate(pageRoutes.home);
      } else {
        setShowNameError(true);
        navigate(pageRoutes.signUp);
      }
    } catch (error) {
      if (error.response.status === 409) {
        setShowNameError(true);
      }
      if (error.code === 'ERR_NETWORK') {
        notifyError(t('errors.notifyNetworkError'));
      }
      if (error.response.status >= 500) {
        notifyError(t('errors.notifyServerError'));
      }
      console.log(error);
    }
  };

  const { signUpSchema } = getSchema(t);

  const formInit = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: signUpSchema,
    onSubmit: (values) => handleSubmit(values),
  });

  return (
    <div className="d-flex flex-column h-100">
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
