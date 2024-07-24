import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Formik, Field, Form } from 'formik';
import { Button } from 'react-bootstrap';
import { io } from 'socket.io-client';
import axios from 'axios';
import {
  getMessages,
  getCountOfMessages,
  addMessage,
} from '../slices/messagesSlice';
import {
  getUser,
  getToken,
  setShowNotifyNetworkError,
  getShowNotifyNetworkError,
  setShowNotifyServerError,
  getShowNotifyServerError,
} from '../slices/authorizationSlice';
import { getActiveChannelId, getActiveChannelName } from '../slices/channelsSlice';
import routes from '../routes';
import censorFunc from '../utils/censor';
import notifyError from '../utils/notifyError';
import '../App.css';
import 'react-toastify/dist/ReactToastify.css';

const socket = io('http://localhost:3000');

const Messages = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleSubmitMessage = async (newMessage, userToken) => {
    try {
      await axios.post(routes.messagesPath(), newMessage, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        dispatch(setShowNotifyNetworkError());
      }
      if (error.response.status >= 500) {
        dispatch(setShowNotifyServerError());
      }
      console.log(error);
    }
  };

  const user = useSelector(getUser);
  const token = useSelector(getToken);
  const isShowNotifyNetworkError = useSelector(getShowNotifyNetworkError);
  const isShowNotifyServerError = useSelector(getShowNotifyServerError);

  const activeChannelName = useSelector(getActiveChannelName);
  const activeChannelId = useSelector(getActiveChannelId);

  const messages = useSelector(getMessages);
  const countOfMessages = useSelector((state) => getCountOfMessages(state, activeChannelId));

  const inputRef = useRef(null);
  console.log('inputRef.current>>>', inputRef.current);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const textMessageToNewMessage = (textValue, channelId, username) => {
    const filteredTextValue = censorFunc(textValue);
    return {
      body: filteredTextValue,
      channelId,
      username,
    };
  };

  useEffect(() => {
    socket.on('newMessage', (currentMessage) => {
      dispatch(addMessage(currentMessage));
    });
    return () => {
      socket.off('newMessage');
    };
  }, [dispatch]);

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

  return (
    <div className="d-flex flex-column h-100">
      <div className="bg-light mb-4 p-3 shadow-sm small">
        <p className="m-0">
          <b>
            {' '}
            {`# ${activeChannelName}`}
          </b>
        </p>
        <span className="text-muted">{t('messages.counter.count', { count: countOfMessages })}</span>
      </div>
      <div id="messages-box" className="chat-messages overflow-auto px-5">
        {messages
          .filter((message) => message.channelId === activeChannelId)
          .map((message) => (
            <div key={message.id} className="text-break mb-2">
              <b>{message.username}</b>
              {`: ${message.body}`}
            </div>
          ))}
      </div>
      <div className="mt-auto px-5 py-3">
        <Formik
          initialValues={{ message: '' }}
          onSubmit={(values, { resetForm }) => {
            const newMessage = textMessageToNewMessage(values.message, activeChannelId, user);
            handleSubmitMessage(newMessage, token);
            resetForm();
          }}
        >
          {({
            handleChange, handleBlur, handleSubmit, isSubmitting, values,
          }) => (
            <Form noValidate className="py-1 border rounded-2" onSubmit={handleSubmit}>
              <div className={values.message === '' ? 'input-group has-validation' : 'input-group'}>
                <Field
                  type="text"
                  name="message"
                  aria-label={t('messages.newMessage')}
                  placeholder={t('messages.inputMesage')}
                  autoComplete="off"
                  className="border-0 p-0 ps-2 form-control"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.message}
                  innerRef={inputRef}
                />
                <Button type="submit" disabled={values.message === '' || isSubmitting} className="btn btn-group-vertical">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                    <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
                  </svg>
                  <span className="visually-hidden">{t('messages.sendButton')}</span>
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Messages;
