/* eslint-disable */
import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, getIsAuthorization, getToken, setToken } from '../slices/authorizationSlice.js';
import { getChannels, setChannels, getShowModalAddChannel, getShowModalRenameChannel, getShowModalDeleteChannel } from '../slices/channelsSlice.js';
import { getMessages, getCountOfMessages, loadMessages } from '../slices/messagesSlice.js';
import { useSelector, useDispatch } from 'react-redux';
import Channels from './Channels.jsx';
import Messages from './Messages.jsx';
import ModalAddChannel from './ModalAddChannel.jsx';
import ModalRenameChannel from './ModalRenameChannel.jsx';
import ModalDeleteChannel from './ModalDeleteChannel.jsx';
//import useAuth from '../hooks/index.jsx';
import routes from '../routes.js';
import '../App.css';

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
  const isShowModalAddChannel = useSelector(getShowModalAddChannel);
  console.log('isShowModalAddChannel>>>', isShowModalAddChannel);
  const isShowModalRenameChannel = useSelector(getShowModalRenameChannel);
  const isShowModalDeleteChannel = useSelector(getShowModalDeleteChannel);

  // Вытащить значения из messagesSlice
  const messages = useSelector(getMessages);
  console.log('messages>>>', messages);
  const countOfMessages = useSelector(getCountOfMessages);
  console.log('countOfMessages>>>', countOfMessages);

  // Функция для получения массива всех каналов и последующей их записи в state
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
  }, [dispatch]);

  return (
    <div className="h-100">
      <div className="h-100" id="chat">
        <div className="d-flex flex-column h-100">
          <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
            <div className="container">
              <a className="navbar-brand" href="/">
                Hexlet Chat
              </a>
              <button type="button" className="btn btn-primary">
                <a href="/login">
                  Выйти
                </a>
              </button>
            </div>
          </nav>
          <div className="container h-100 my-4 overflow-hidden rounded shadow">
            <div className="row h-100 bg-white flex-md-row">
              <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
                <Channels />
              </div>
              <div className="col p-0 h-100">
                <Messages />
              </div>
            </div>
          </div>
          {isShowModalAddChannel && <ModalAddChannel />}
          {isShowModalRenameChannel && <ModalRenameChannel />}
          {isShowModalDeleteChannel && <ModalDeleteChannel />}
        </div>
      </div>
    </div>
  );
};
