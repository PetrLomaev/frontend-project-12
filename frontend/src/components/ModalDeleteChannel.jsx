import React, { useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {
  setActiveChannel,
  getActiveChannelForDelete,
  setShowModalDeleteChannel,
  setDeleteChannel,
  setShowNotifyDeleteChannel,
} from '../slices/channelsSlice';
import { deleteMessagesDuringDeleteChannel } from '../slices/messagesSlice';
import routes from '../routes';
import {
  getToken,
  setShowNotifyNetworkError,
  getShowNotifyNetworkError,
  setShowNotifyServerError,
  getShowNotifyServerError,
} from '../slices/authorizationSlice';
import notifyError from '../utils/notifyError';
import 'react-toastify/dist/ReactToastify.css';
// import { io } from 'socket.io-client';

// const socket = io('http://localhost:3000');

const ModalDeleteChannel = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // Вытащить значения из authorizationSlice
  const token = useSelector(getToken);
  const isShowNotifyNetworkError = useSelector(getShowNotifyNetworkError);
  const isShowNotifyServerError = useSelector(getShowNotifyServerError);

  // При закрытии окна - изменяем в стейте showModalDeleteChannel на true или false
  const handleSetShowModalDeleteChannel = () => {
    dispatch(setShowModalDeleteChannel());
  };

  // Функция для удаления канала по имени и последующего обновления в state
  const handleSetDeleteChannel = async (userToken, deletedChannelId) => {
    const pathToDeleteChannel = [routes.channelsPath(), deletedChannelId].join('/');
    // const pathToDeleteMessage = [routes.messagesPath(), deletedChannelId].join('/');
    try {
      const response = await axios.delete(pathToDeleteChannel, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (response.data) {
        dispatch(setDeleteChannel({ id: response.data.id }));
        /* Нужно ли это?
        await axios.delete(pathToDeleteMessage, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        */
        dispatch(deleteMessagesDuringDeleteChannel({ id: response.data.id }));
        handleSetShowModalDeleteChannel();
        dispatch(setActiveChannel(1)); // После удаления сделать активным дефолтный канал
        dispatch(setShowNotifyDeleteChannel());
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

  /*
  useEffect(() => {
    socket.on('newChannel', (currentNewChannel) => {
      console.log('Current newChannel>>>', currentNewChannel);
      dispatch(addChannel(currentNewChannel));
    });
    return () => {
      socket.off('newChannel');
    };
  }, []);
  */

  const activeChannelForDelete = useSelector(getActiveChannelForDelete);

  return (
    <Modal show onHide={handleSetShowModalDeleteChannel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('channels.channelDelete')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">{t('channels.areYouSure')}</p>
        <div className="d-flex justify-content-end">
          <Button variant="secondary" className="me-2" onClick={handleSetShowModalDeleteChannel}>
            {t('channels.cancelButton')}
          </Button>
          <Button variant="danger" type="submit" disabled="" onClick={() => handleSetDeleteChannel(token, activeChannelForDelete.id)}>
            {t('channels.deleteButton')}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalDeleteChannel;
