/* eslint-disable */

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Formik, Field, Form} from 'formik';
import { Button } from 'react-bootstrap';
import { io } from 'socket.io-client';
import { getMessages, getCountOfMessages, addMessage } from '../slices/messagesSlice.js';
import { getUser, getToken } from '../slices/authorizationSlice.js';
import { getActiveChannelId, getActiveChannelName } from '../slices/channelsSlice.js';
import axios from 'axios';
import routes from '../routes.js';

const socket = io('http://localhost:3000');

const handleSubmitMessage = async (newMessage, token) => {
  try {
    const response = await axios.post(routes.messagesPath(), newMessage, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    //const tokenValueInStorage = localStorage.getItem('token');
  }
  catch (e) {
    console.log(e);
  }
}

const Messages = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // Вытащить значения из authorizationSlice
  const user = useSelector(getUser);
  const token = useSelector(getToken);

  // Вытащить значения из channelsSlice
  const activeChannelName = useSelector(getActiveChannelName);
  const activeChannelId = useSelector(getActiveChannelId);

  // Вытащить значения из messagesSlice
  const messages = useSelector(getMessages);
  const countOfMessages = useSelector((state) => getCountOfMessages(state, activeChannelId));

  const textMessageToNewMessage = (textValue, channelId, username) => {
    return {
      body: textValue,
      channelId,
      username,
    }
  };

  useEffect(() => {
    socket.on('newMessage', (currentMessage) => {
      console.log('Current newMessage>>>', currentMessage);
      dispatch(addMessage(currentMessage));
    });
    return () => {
      socket.off('newMessage');
    };
  }, [dispatch]);

  return (
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0"><b># {activeChannelName}</b></p>
          <span className="text-muted">{t('messages.counter.count', { count: countOfMessages })}</span>
        </div>
        <div id="messages-box" className="chat-messages overflow-auto px-5 ">
          {messages
          .filter((message) => message.channelId === activeChannelId)
          .map((message) => (
            <div className="text-break mb-2">
              <b key={message.channelId}>{message.username}</b>: {message.body}</div>
          ))}
        </div>
        <div className="mt-auto px-5 py-3">
        <Formik
          initialValues={{ message: '' }}
          onSubmit={(values) => {
            const newMessage = textMessageToNewMessage(values.message, activeChannelId, user);
            handleSubmitMessage(newMessage, token);
            
          }}
        >
        {({ handleChange, handleBlur, values }) => (
          <Form noValidate className="py-1 border rounded-2">
            <div className="input-group has-validation">
              <Field
                type="text"
                name="message"
                aria-label={t('messages.newMessage')}
                autoComplete="off"
                placeholder={t('messages.inputMesage')}
                className="border-0 p-0 ps-2 form-control"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.message}
              />
              <Button type="submit" disabled="" className="btn btn-group-vertical">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                  <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z">
                  </path>
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