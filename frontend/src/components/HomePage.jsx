import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { notifySucess } from '../utils/notifyError';
import { getIsAuthorization, logOut } from '../slices/authorizationSlice';
import {
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
} from '../slices/channelsSlice';
import { loadMessages } from '../slices/messagesSlice';
import Channels from './Channels';
import Messages from './Messages';
import ModalAddChannel from './ModalAddChannel';
import ModalRenameChannel from './ModalRenameChannel';
import ModalDeleteChannel from './ModalDeleteChannel';
import routes from '../routes';
import '../App.css';
import 'react-toastify/dist/ReactToastify.css';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const token = localStorage.getItem('token');
  const isAuthorization = useSelector(getIsAuthorization);

  const isShowModalAddChannel = useSelector(getShowModalAddChannel);
  const isShowModalRenameChannel = useSelector(getShowModalRenameChannel);
  const isShowModalDeleteChannel = useSelector(getShowModalDeleteChannel);
  const isShowNotifyAddChannel = useSelector(getShowNotifyAddChannel);
  const isShowNotifyRenameChannel = useSelector(getShowNotifyRenameChannel);
  const isShowNotifyDeleteChannel = useSelector(getShowNotifyDeleteChannel);

  useEffect(() => {
    const getChannelsData = async (userToken) => {
      try {
        const responseChannels = await axios.get(routes.channelsPath(), {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        const channelsData = responseChannels.data;
        dispatch(setChannels(channelsData));
      } catch (e) {
        console.log(e);
      }
    };

    getChannelsData(token);
  }, [dispatch, token]);

  useEffect(() => {
    const getMessagesData = async (userToken) => {
      try {
        const responseMessages = await axios.get(routes.messagesPath(), {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        const messagesData = responseMessages.data;
        dispatch(loadMessages(messagesData));
      } catch (e) {
        console.log(e);
      }
    };

    getMessagesData(token);
  }, [dispatch, token]);

  useEffect(() => {
    if (!isAuthorization) {
      navigate('/login');
    }
  });

  useEffect(() => {
    if (isShowNotifyAddChannel) {
      notifySucess(t('channels.notifyAdd'));
      dispatch(setShowNotifyAddChannel());
    }
  }, [isShowNotifyAddChannel, dispatch, t]);

  useEffect(() => {
    if (isShowNotifyRenameChannel) {
      notifySucess(t('channels.notifyRename'));
      dispatch(setShowNotifyRenameChannel());
    }
  }, [isShowNotifyRenameChannel, dispatch, t]);

  useEffect(() => {
    if (isShowNotifyDeleteChannel) {
      notifySucess(t('channels.notifyDelete'));
      dispatch(setShowNotifyDeleteChannel());
    }
  }, [isShowNotifyDeleteChannel, dispatch, t]);

  const handleLogOut = () => {
    dispatch(logOut());
  };

  const handleLinkClick = (e) => {
    if (isAuthorization) {
      e.preventDefault();
    } else {
      navigate('/');
    }
  };

  return (isAuthorization
    && (
    <div className="h-100">
      <div className="h-100" id="chat">
        <div className="d-flex flex-column h-100">
          <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
            <div className="container">
              <a className="navbar-brand" href="/" onClick={handleLinkClick}>
                {t('headerChat.header')}
              </a>
              <button type="button" className="btn btn-primary" onClick={handleLogOut}>
                {t('homePage.exitButton')}
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
    )
  );
};

export default HomePage;
