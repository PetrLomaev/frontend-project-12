/* eslint-disable */
import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getUser, getIsAuthorization, getToken, setToken, logOut } from '../slices/authorizationSlice.js';
import {
  getChannels,
  setChannels,
  getShowModalAddChannel,
  getShowModalRenameChannel,
  getShowModalDeleteChannel,
  getShowNotifyAddChannel,
  getShowNotifyRenameChannel,
  getShowNotifyDeleteChannel,
  setShowNotifyAddChannel,
  setShowNotifyRenameChannel,
  setShowNotifyDeleteChannel,
} from '../slices/channelsSlice.js';
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
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const { t } = useTranslation();

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
  const isShowNotifyAddChannel = useSelector(getShowNotifyAddChannel);
  const isShowNotifyRenameChannel = useSelector(getShowNotifyRenameChannel);
  const isShowNotifyDeleteChannel = useSelector(getShowNotifyDeleteChannel);

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

  // Функция для кнопки выхода из чата
  const handleLogOut = () => {
    dispatch(logOut());
  };

  useEffect(() => {
    getChannelsData(token);
  }, [dispatch]);
  /*
  useEffect(() => {
    getMessagesData(token);
  }, [dispatch]);
  */
  useEffect(() => {
    if (!isAuthorization) {
      navigate('/login');
    }
  });

  const notifyAddChannel = () => {
    toast.success(t('channels.notifyAdd'), {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };

  const notifyRenameChannel = () => {
    toast.success(t('channels.notifyRename'), {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };

  const notifyDeleteChannel = () => {
    toast.success(t('channels.notifyDelete'), {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };

  useEffect(() => {
    if (isShowNotifyAddChannel) {
      notifyAddChannel();
      dispatch(setShowNotifyAddChannel());
    }
  }, [isShowNotifyAddChannel]);

  useEffect(() => {
    if (isShowNotifyRenameChannel) {
      notifyRenameChannel();
      dispatch(setShowNotifyRenameChannel());
    }
  }, [isShowNotifyRenameChannel]);

  useEffect(() => {
    if (isShowNotifyDeleteChannel) {
      notifyDeleteChannel();
      dispatch(setShowNotifyDeleteChannel());
    }
  }, [isShowNotifyDeleteChannel]);



  return (
    <div className="h-100">
      <div className="h-100" id="chat">
        <div className="d-flex flex-column h-100">
          <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
            <div className="container">
              <a className="navbar-brand" href="/">
                {t('headerChat.header')}
              </a>
              <button type="button" className="btn btn-primary" onClick={handleLogOut}>
                <a>{t('homePage.exitButton')}</a>
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
        <div className="Toastify">
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};
