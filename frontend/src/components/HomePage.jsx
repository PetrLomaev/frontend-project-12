/* eslint-disable */
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

import { Button, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUser, getIsAuthorization, getToken, setToken } from '../slices/authorizationSlice.js';
import { getChannels, getActiveChannel, setChannels } from '../slices/channelsSlice.js';
import { getMessages, getAmountOfMessages, loadMessages } from '../slices/messagesSlice.js';
import { useSelector, useDispatch } from 'react-redux';
import Channels from './Channels.jsx';
import Messages from './Messages.jsx';
//import useAuth from '../hooks/index.jsx';
import routes from '../routes.js';

/*
const handleClick = () => {
  //localStorage.clear();
  const navigate = useNavigate();
  navigate('/login');
};
*/

export const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Вытащить значения из authorizationSlice
  const token = useSelector(getToken);
  console.log('token in HomePage>>>', token);
  const user = useSelector(getUser);
  console.log('user>>>', user);
  const isAuthorization = useSelector(getIsAuthorization);
  console.log('isAuthorization>>>', isAuthorization);

  // Вытащить значения из channelsSlice
  const channels = useSelector(getChannels);
  console.log('channels>>>', channels);
  const activeChannel = useSelector(getActiveChannel);
  console.log('activeChannel>>>', activeChannel);

  // Вытащить значения из messagesSlice
  const messages = useSelector(getMessages);
  console.log('messages>>>', messages);
  const amountOfMessages = useSelector(getAmountOfMessages);
  console.log('amountOfMessages>>>', amountOfMessages);

  // Функция для получения массива каналов и последующей их записи в state
  const getChannelsData = async (token) => {
    try {
      const responseChannels = await axios.get(routes.channelsPath(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const channelsData = responseChannels.data;
      dispatch(setChannels(channelsData));
    }
    catch (e) {
      console.log(e);
    }
  };

    // Функция для получения массива всех сообщений и последующей их записи в state
  const getMessagesData = async (token) => {
    try {
      const responseMessages = await axios.get(routes.messagesPath(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const messagesData = responseMessages.data;
      dispatch(loadMessages(messagesData));
    }
    catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getChannelsData(token);
    getMessagesData(token);
  }, []);

  return (
  <div className="row h-100 bg-white flex-md-row">
    <Button><a href='/login'>Выйти</a></Button>
    <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>Каналы</b>
        <button type="button" className="p-0 text-primary btn btn-group-vertical">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"></path>
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
          </svg>
          <span className="visually-hidden">+</span>
        </button>
      </div>
      <Channels />
    </div>
    <Messages />
  </div>
  );
};
