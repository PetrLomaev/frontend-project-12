/* eslint-disable */
import { Formik, Form, Field } from 'formik';
import startImage from '../images/start-image.jpg';

const BuildPage = (index) => (
  <>
    <h3>Page {index}</h3>
    <div>
      Something text {index}
    </div>
  </>
);

export const PageOne = () => (
  <Formik
  initialValues={{ username: "", password: "" }}
  onSubmit={({ setSubmitting }) => {
    console.log("Form is validated! Submitting the form...");
    setSubmitting(false);
  }}
>
  {() => (
    <Form>
      <div className="form-group">
        <label htmlFor="username">Логин</label>
        <Field
          type="username"
          name="username"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Пароль</label>
        <Field
          type="password"
          name="password"
          className="form-control"
        />
      </div>
    </Form>
  )}
</Formik>
);
export const PageTwo = () => {
    return (
    <div className="card shadow-sm">
      <div className="card-body row p-5">
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
          <img src={startImage} className="rounded-circle" alt="Войти" />
        </div>
        <form className="col-12 col-md-6 mt-3 mt-mb-0">
          <h1 className="text-center mb-4">Войти</h1>
          <div className="form-floating mb-3">
            <input name="username" autocomplete="username" required="" placeholder="Ваш ник" id="username" className="form-control" value="" />
            <label for="username">Ваш ник</label>
          </div>
          <div className="form-floating mb-4">
            <input name="password" autocomplete="current-password" required="" placeholder="Пароль" type="password" id="password" className="form-control" value="" />
            <label className="form-label" for="password">Пароль</label>
          </div>
          <button type="submit" className="w-100 mb-3 btn btn-outline-primary">Войти</button>
        </form>
      </div>
      <div className="card-footer p-4">
        <div className="text-center">
          <span>Нет аккаунта?</span> <a href="/signup">Регистрация</a>
        </div>
      </div>
    </div>
  )
};
export const PageThree = () => BuildPage('Пустая страница');