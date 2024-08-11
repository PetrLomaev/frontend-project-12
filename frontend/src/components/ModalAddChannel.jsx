import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';
import * as yup from 'yup';
import { getChannels, setActiveChannel, setShowModalAddChannel } from '../slices/channelsSlice';
import { serverRoutes } from '../routes';
import { useProfanity } from '../hooks/index';
import { notifySucess, notifyError } from '../utils/notifyError';
import 'react-toastify/dist/ReactToastify.css';

const ModalAddChannel = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const profanity = useProfanity();
  const getFilteredChannelName = (message) => profanity(message).trim();

  const token = localStorage.getItem('token');

  const inputRef = useRef(null);

  const handleSetShowModalAddChannel = () => {
    dispatch(setShowModalAddChannel());
  };

  const handleAddChannel = async (name, userToken) => {
    const newChannel = { name: getFilteredChannelName(name) };
    try {
      const response = await axios.post(serverRoutes.channelsPath(), newChannel, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (response.data) {
        dispatch(setActiveChannel(response.data.id));
        notifySucess(t('channels.notifyAdd'));
        handleSetShowModalAddChannel();
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

  const channels = useSelector(getChannels);

  useEffect(() => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  }, []);

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

  const formInit = useFormik({
    initialValues: {
      newChannelName: '',
    },
    validationSchema: schema,
    onSubmit: (values) => handleAddChannel(values.newChannelName, token),
  });

  return (
    <Modal show onHide={handleSetShowModalAddChannel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('channels.addHeader')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formInit.handleSubmit}>
          <Form.Group controlId="newChannelName">
            <Form.Label visuallyHidden>{t('channels.channelName')}</Form.Label>
            <Form.Control
              name="newChannelName"
              className="mb-2"
              onChange={formInit.handleChange}
              onBlur={formInit.handleBlur}
              value={formInit.values.newChannelName}
              ref={inputRef}
              isInvalid={formInit.touched.newChannelName && (!!formInit.errors.newChannelName)}
            />
            <Form.Control.Feedback type="invalid">
              {formInit.errors.newChannelName}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" className="me-2" onClick={handleSetShowModalAddChannel}>
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

export default ModalAddChannel;
