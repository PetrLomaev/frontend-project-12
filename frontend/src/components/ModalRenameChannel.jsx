import React, { useEffect, useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Formik, Field, Form, ErrorMessage,
} from 'formik';
import axios from 'axios';
import * as yup from 'yup';
import {
  getChannels,
  setShowModalRenameChannel,
  setNewChannelName,
  getActiveChannelForRename,
  setShowNotifyRenameChannel,
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

const ModalRenameChannel = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const token = useSelector(getToken);
  const isShowNotifyNetworkError = useSelector(getShowNotifyNetworkError);
  const isShowNotifyServerError = useSelector(getShowNotifyServerError);

  const inputRef = useRef(null);

  const handleSetShowModalRenameChannel = () => {
    dispatch(setShowModalRenameChannel());
  };

  const handleSetNewChannelName = async (newName, userToken, changingChannelId) => {
    const filteredName = censorFunc(newName);
    const newEdditedChannelName = { name: filteredName };
    const pathToRenameChannel = [routes.channelsPath(), changingChannelId].join('/');
    try {
      const response = await axios.patch(pathToRenameChannel, newEdditedChannelName, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (response.data) {
        dispatch(setNewChannelName({ id: response.data.id, newName: response.data.name }));
        handleSetShowModalRenameChannel();
        dispatch(setShowNotifyRenameChannel());
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

  useEffect(() => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, 100);
  }, []);

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

  const channels = useSelector(getChannels);
  const activeChannelForRename = useSelector(getActiveChannelForRename);

  const isUniqueChannelName = (name) => {
    const checkCannels = channels.filter((channel) => channel.name === name);
    return !(checkCannels.length > 0);
  };

  const schema = yup.object().shape({
    renameChannelName: yup.string()
      .required(t('errors.notBeEmpty'))
      .min(3, t('errors.min3'))
      .max(20, t('errors.max20'))
      .test('is-unique', t('errors.isUnique'), (value) => isUniqueChannelName(value)),
  });

  return (
    <Modal show onHide={handleSetShowModalRenameChannel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('channels.channelRename')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ renameChannelName: activeChannelForRename.name }}
          validationSchema={schema}
          onSubmit={(values) => {
            handleSetNewChannelName(values.renameChannelName, token, activeChannelForRename.id);
          }}
        >
          {({ handleChange, handleBlur, values }) => (
            <Form noValidate className="mb-2">
              <Field
                type="text"
                name="renameChannelName"
                aria-label={t('channels.channelNewName')}
                autoComplete="off"
                placeholder=""
                className="form-control"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.renameChannelName}
                innerRef={inputRef}
              />
              <ErrorMessage
                component="div"
                name="renameChannelName"
                className="text-danger"
              />
              <Modal.Footer>
                <Button variant="secondary" onClick={handleSetShowModalRenameChannel}>
                  {t('channels.cancelButton')}
                </Button>
                <Button variant="primary" type="submit" disabled="">
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

export default ModalRenameChannel;
