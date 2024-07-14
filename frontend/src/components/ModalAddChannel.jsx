import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import {
  Formik, Field, Form, ErrorMessage,
} from 'formik';
import axios from 'axios';
import * as yup from 'yup';
import {
  getChannels, setActiveChannel, setShowModalAddChannel, addChannel, setShowNotifyAddChannel,
} from '../slices/channelsSlice';
import routes from '../routes';
import {
  getToken,
  setShowNotifyNetworkError,
  getShowNotifyNetworkError,
  setShowNotifyServerError,
  getShowNotifyServerError,
} from '../slices/authorizationSlice';
// import { io } from 'socket.io-client';
import censorFunc from '../utils/censor';
import notifyError from '../utils/notifyError';
import 'react-toastify/dist/ReactToastify.css';

// const socket = io('http://localhost:3000');

const ModalAddChannel = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const token = useSelector(getToken);
  const isShowNotifyNetworkError = useSelector(getShowNotifyNetworkError);
  const isShowNotifyServerError = useSelector(getShowNotifyServerError);

  const handleSetShowModalAddChannel = () => {
    dispatch(setShowModalAddChannel());
  };

  const handleAddChannel = async (name, userToken) => {
    const filteredName = censorFunc(name);
    const newChannel = { name: filteredName };
    try {
      const response = await axios.post(routes.channelsPath(), newChannel, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (response.data) {
        console.log('New channel data>>>', response.data);
        dispatch(addChannel(response.data));
        dispatch(setActiveChannel(response.data.id));
        dispatch(setShowNotifyAddChannel());
        handleSetShowModalAddChannel();
      }
    } catch (error) {
      console.log(error);
      if (error.code === 'ERR_NETWORK') {
        dispatch(setShowNotifyNetworkError());
      }
      if (error.response.status >= 500) {
        dispatch(setShowNotifyServerError());
      }
    }
  };
  /*
  useEffect(() => {
    socket.on('newChannel', (currentNewChannel) => {
      console.log('Current newChannel>>>', currentNewChannel);
      dispatch(addChannel(currentNewChannel));
    });
    return () => {
      socket.off('newChannel');
    };
  }, []);
  */
  const channels = useSelector(getChannels);

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

  const isUniqueChannelName = (name) => {
    const checkChannels = channels.filter((channel) => channel.name === name);
    return !(checkChannels.length > 0);
  };

  const schema = yup.object().shape({
    newChannelName: yup.string()
      .required(t('errors.notBeEmpty'))
      .min(3, t('errors.min3'))
      .max(20, t('errors.max20'))
      .test('is-unique', t('errors.isUnique'), (value) => isUniqueChannelName(value)),
  });

  return (
    <Modal show onHide={handleSetShowModalAddChannel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('channels.addButton')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ newChannelName: '' }}
          validationSchema={schema}
          onSubmit={(values) => {
            handleAddChannel(values.newChannelName, token);
          }}
        >
          {({ handleChange, handleBlur, values }) => (
            <Form noValidate className="mb-2">
              <Field
                type="text"
                name="newChannelName"
                aria-label={t('channels.channelName')}
                autoComplete="off"
                placeholder=""
                className="form-control"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.newChannelName}
              />
              <ErrorMessage
                component="div"
                name="newChannelName"
                className="text-danger"
              />
              <Modal.Footer>
                <Button variant="secondary" onClick={handleSetShowModalAddChannel}>
                  {t('channels.cancelButton')}
                </Button>
                <Button variant="primary" type="submit">
                  {t('channels.sendButton')}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default ModalAddChannel;
