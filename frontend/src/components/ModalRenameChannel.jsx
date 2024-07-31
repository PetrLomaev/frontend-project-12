import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import {
  Button, Form, Modal,
} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import * as yup from 'yup';
import { io } from 'socket.io-client';
import {
  getChannels,
  setShowModalRenameChannel,
  setNewChannelName,
  getActiveChannelForRename,
  setShowNotifyRenameChannel,
} from '../slices/channelsSlice';
import routes from '../routes';
import {
  // getToken,
  setShowNotifyNetworkError,
  getShowNotifyNetworkError,
  setShowNotifyServerError,
  getShowNotifyServerError,
} from '../slices/authorizationSlice';
import censorFunc from '../utils/censor';
import notifyError from '../utils/notifyError';
import 'react-toastify/dist/ReactToastify.css';

const socket = io('http://localhost:3000');

const ModalRenameChannel = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // const token = useSelector(getToken);
  const token = localStorage.getItem('token');
  const isShowNotifyNetworkError = useSelector(getShowNotifyNetworkError);
  const isShowNotifyServerError = useSelector(getShowNotifyServerError);

  const inputRef = useRef(null);

  const handleSetShowModalRenameChannel = () => {
    dispatch(setShowModalRenameChannel());
  };

  const handleSetNewChannelName = async (name, userToken, changingChannelId) => {
    const filteredName = censorFunc(name);
    const newEdditedChannelName = { name: filteredName };
    const pathToRenameChannel = [routes.channelsPath(), changingChannelId].join('/');
    try {
      const response = await axios.patch(pathToRenameChannel, newEdditedChannelName, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (response.data) {
        dispatch(setNewChannelName({ id: response.data.id, name: response.data.name }));
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

  useEffect(() => {
    socket.on('renameChannel', (currentRenameChannel) => {
      // console.log('currentRenameChannel>>>', currentRenameChannel);
      // const update = { name: currentRenameChannel.name };
      dispatch(setNewChannelName({ id: currentRenameChannel.id, name: currentRenameChannel.name }));
    });
    return () => {
      socket.off('renameChannel');
    };
  }, []);

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

  const formInit = useFormik({
    initialValues: {
      renameChannelName: activeChannelForRename.name,
    },
    validationSchema: schema,
    onSubmit: (values) => {
      handleSetNewChannelName(values.renameChannelName, token, activeChannelForRename.id);
    },
  });

  return (
    <Modal show onHide={handleSetShowModalRenameChannel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('channels.channelRename')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formInit.handleSubmit}>
          <Form.Group controlId="renameChannelName">
            <Form.Label visuallyHidden>{t('channels.channelName')}</Form.Label>
            <Form.Control
              name="renameChannelName"
              className="mb-2"
              onChange={formInit.handleChange}
              onBlur={formInit.handleBlur}
              value={formInit.values.renameChannelName}
              ref={inputRef}
              isInvalid={formInit.touched.renameChannelName
                && (!!formInit.errors.renameChannelName)}
            />
            <Form.Control.Feedback type="invalid">
              {formInit.errors.renameChannelName}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" className="me-2" onClick={handleSetShowModalRenameChannel}>
              {t('channels.cancelButton')}
            </Button>
            <Button variant="primary" type="submit">
              {t('channels.sendButton')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalRenameChannel;
