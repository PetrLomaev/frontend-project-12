/* eslint-disable */
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
// import { Formik, Form, Field } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/index.jsx';
import routes from '../routes.js';
import startImage from '../images/start-image.jpeg';
import * as yup from 'yup';
import { getUser, getIsAuthorization, getToken, setToken, setUser, logIn } from '../slices/authorizationSlice.js';
import { useSelector, useDispatch } from 'react-redux';

const schema = yup.object().shape({
  username: yup.string().required('Обязательное поле'),
  password: yup.string().required('Обязательное поле'),
});

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
    
    if (tokenValueInStorage.length > 0) {
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

  const authInit = useAuth();
  console.log('authInit>>>', authInit);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
          <a className="navbar-brand" href="/">Hexlet Chat</a>
        </div>
      </nav>
  
      <div className="container-fluid h-100">
        <div className="row justify-content-center align-content-center h-100">
          <div className="col-12 col-md-6">
            <div className="card shadow-sm">
              <div className="card-body row p-5">
                <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                  <img src= {startImage} className="rounded-circle" alt="Войти"></img>
                </div>
                <div className="col-12 col-md-6">
                <Form onSubmit={formInit.handleSubmit}>
                    <h1 className="text-center mb-4">Войти</h1>
                    <Form.Group className="mb-3">
                    <Form.Label>Ваш Ник</Form.Label>
                      <Form.Control type="text"
                        placeholder="Ваш ник"
                        autoComplete="username"
                        id="username"
                        onChange={formInit.handleChange}
                        onBlur={formInit.handleBlur}
                        value={formInit.values.username} />
                    </Form.Group>
  
                    <Form.Group className="mb-3" >
                      <Form.Label>Пароль</Form.Label>
                      <Form.Control type="password"
                        placeholder='Пароль'
                        id="password"
                        autoComplete="password"
                        onChange={formInit.handleChange}
                        onBlur={formInit.handleBlur}
                        value={formInit.values.password} />
                        {showError && (
                      <div className="invalid-feedback" style={{ display: 'block', color: 'red' }}>Неверные имя пользователя или пароль</div>
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
                          <span>Нет аккаунта? </span>
                            <a href="/signup">Регистрация</a>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );


};

//export default LoginPage;