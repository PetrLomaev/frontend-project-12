import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { notifyError } from '../utils/notifyError';
import { getIsAuthorization } from '../slices/authorizationSlice';
import {
  setChannels,
  getShowModalAddChannel,
  getShowModalRenameChannel,
  getShowModalDeleteChannel,
} from '../slices/channelsSlice';
import { loadMessages } from '../slices/messagesSlice';
import Channels from './Channels';
import Messages from './Messages';
import ModalAddChannel from './ModalAddChannel';
import ModalRenameChannel from './ModalRenameChannel';
import ModalDeleteChannel from './ModalDeleteChannel';
import { serverRoutes, pageRoutes } from '../routes';
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

  useEffect(() => {
    const getChannelsData = async (userToken) => {
      try {
        const responseChannels = await axios.get(serverRoutes.channelsPath(), {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        const channelsData = responseChannels.data;
        dispatch(setChannels(channelsData));
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

    getChannelsData(token);
  }, [dispatch, t, token]);

  useEffect(() => {
    const getMessagesData = async (userToken) => {
      try {
        const responseMessages = await axios.get(serverRoutes.messagesPath(), {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        const messagesData = responseMessages.data;
        dispatch(loadMessages(messagesData));
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

    getMessagesData(token);
  }, [dispatch, t, token]);

  useEffect(() => {
    if (!isAuthorization) {
      navigate(pageRoutes.login);
    }
  });

  return (isAuthorization
    && (
    <div className="h-100">
      <div className="h-100" id="chat">
        <div className="d-flex flex-column h-100">
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
