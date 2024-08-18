import * as yup from 'yup';

const getSchema = (t, channelNames = []) => {
  const loginSchema = yup.object().shape({
    username: yup.string().required(t('errors.requiredField')),
    password: yup.string().required(t('errors.requiredField')),
  });

  const signUpSchema = yup.object().shape({
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

  const addChannelSchema = yup.object().shape({
    newChannelName: yup.string()
      .required(t('errors.notBeEmpty'))
      .min(3, t('errors.min3'))
      .max(20, t('errors.max20'))
      .notOneOf(channelNames, t('errors.isUnique')),
  });

  const renameChannelSchema = yup.object().shape({
    renameChannelName: yup.string()
      .required(t('errors.notBeEmpty'))
      .min(3, t('errors.min3'))
      .max(20, t('errors.max20'))
      .notOneOf(channelNames, t('errors.isUnique')),
  });

  return {
    loginSchema,
    signUpSchema,
    addChannelSchema,
    renameChannelSchema,
  };
};

export default getSchema;
