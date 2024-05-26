/* eslint-disable */
import { Formik, Form, Field } from 'formik';
import startImage from '../images/start-image.jpeg';

const BuildPage = (index) => (
  <>
    <h3>Page {index}</h3>
    <div>
      Something text {index}
    </div>
  </>
);

export const PageOne = () => (
  <div className="card shadow-sm">
    <div className="card-body row p-5">
      <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
        <img src={startImage} className="rounded-circle" alt="Войти" />
      </div>
  <Formik
  initialValues={{ username: "", password: "" }}
  onSubmit={({ setSubmitting }) => {
    console.log("Form is validated! Submitting the form...");
    setSubmitting(false);
  }}
>
  {() => (
    <Form>
      <h1 className="text-center mb-4">Войти</h1>
      <div className="form-group">
        <label htmlFor="username">Ваш ник</label>
        <Field
          type="username"
          name="username"
          autocomplete="username"
          required=""
          placeholder="Ваш ник"
          id="username"
          className="form-control"
          value=""
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="password">Пароль</label>
        <Field
          type="password"
          name="password"
          autocomplete="current-password"
          required=""
          placeholder="Пароль"
          id="password"
          className="form-control"
          value=""
        />
      </div>
      <button type="submit" className="w-100 mb-3 btn btn-outline-primary">Войти</button>
    </Form>
  )}
</Formik>
    </div>
    <div className="card-footer p-4">
      <div className="text-center">
        <span>Нет аккаунта?</span> <a href="/signup">Регистрация</a>
      </div>
    </div>
  </div>
);

export const PageThree = () => BuildPage('Пустая страница');