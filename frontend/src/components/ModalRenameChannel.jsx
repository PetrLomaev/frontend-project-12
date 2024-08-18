import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { Button, Form, Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import getSchema from '../utils/validation';
import {
  getChannels,
  setShowModalRenameChannel,
  getActiveChannelForChange,
} from '../slices/channelsSlice';
import { serverRoutes } from '../routes';
import { useProfanity } from '../hooks/index';
import { notifySucess, notifyError } from '../utils/notifyError';
import 'react-toastify/dist/ReactToastify.css';

const ModalRenameChannel = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const profanity = useProfanity();
  const getFilteredChannelName = (message) => profanity(message).trim();

  const token = localStorage.getItem('token');
  const inputRef = useRef(null);

  const handleSetShowModalRenameChannel = () => {
    dispatch(setShowModalRenameChannel());
  };

  const handleSetNewChannelName = async (name, userToken, changingChannelId) => {
    const newEdditedChannelName = { name: getFilteredChannelName(name) };
    const pathToRenameChannel = [serverRoutes.channelsPath(), changingChannelId].join('/');
    try {
      const response = await axios.patch(pathToRenameChannel, newEdditedChannelName, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (response.data) {
        handleSetShowModalRenameChannel();
        notifySucess(t('channels.notifyRename'));
      }
    } catch (error) {
      console.log(error);
      if (error.code === 'ERR_NETWORK') {
        notifyError(t('errors.notifyNetworkError'));
      }
      if (error.response.status >= 500) {
        notifyError(t('errors.notifyServerError'));
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, 100);
  }, []);

  const channels = useSelector(getChannels);
  const activeChannelForRename = useSelector(getActiveChannelForChange);

  const allAddedChannelNames = channels.map((channel) => channel.name);
  const { renameChannelSchema } = getSchema(t, allAddedChannelNames);

  const formInit = useFormik({
    initialValues: {
      renameChannelName: activeChannelForRename.name,
    },
    validationSchema: renameChannelSchema,
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
