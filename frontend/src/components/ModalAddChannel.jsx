

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { getChannels, setActiveChannel, setShowModalAddChannel, addChannel, setShowNotifyAddChannel } from '../slices/channelsSlice.js';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import axios from 'axios';
import routes from '../routes.js';
import { getToken, setShowNotifyNetworkError, getShowNotifyNetworkError, setShowNotifyServerError, getShowNotifyServerError } from '../slices/authorizationSlice.js';
//import { io } from 'socket.io-client';
import * as yup from 'yup';
import censorFunc from '../utils/censor.js';
import notifyError from '../utils/notifyError.js';
import 'react-toastify/dist/ReactToastify.css';

// const socket = io('http://localhost:3000');

const ModalAddChannel = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // Вытащить значения из authorizationSlice
  const token = useSelector(getToken);
  const isShowNotifyNetworkError = useSelector(getShowNotifyNetworkError);
  const isShowNotifyServerError = useSelector(getShowNotifyServerError);

  // При закрытии окна - изменяем в стейте showModalAddChannel на true или false
  const handleSetShowModalAddChannel = () => {
    dispatch(setShowModalAddChannel());
  };

  // Функция для добавления канала по имени и последующей его записи в state
  const handleAddChannel = async (name, token) => {
    const filteredName = censorFunc(name);
    const newChannel = { name: filteredName };
    try {
      const response = await axios.post(routes.channelsPath(), newChannel, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data) {
        console.log('New channel data>>>', response.data);
        dispatch(addChannel(response.data));
        dispatch(setActiveChannel(response.data.id));
        dispatch(setShowNotifyAddChannel());
        handleSetShowModalAddChannel();
      }
    }
    catch (error) {
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
  }, [isShowNotifyNetworkError]);

  useEffect(() => {
    if (isShowNotifyServerError) {
      notifyError(t('errors.notifyServerError'));
      dispatch(setShowNotifyServerError());
    }
  }, [isShowNotifyServerError]);

  const isUniqueChannelName = (name) => {
    const checkChannels = channels.filter((channel) => channel.name === name);
    return checkChannels.length > 0 ? false : true;
  };

  const schema = yup.object().shape({
    newChannelName: yup.string()
    .required(t('errors.notBeEmpty'))
    .min(3, t('errors.min3'))
    .max(20, t('errors.max20'))
    .test('is-unique', t('errors.isUnique'), (value) => isUniqueChannelName(value))
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
                className="invalid-feedback"
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