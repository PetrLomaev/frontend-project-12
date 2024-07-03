/* eslint-disable */

import React, { useEffect, useState, useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  getChannels,
  setActiveChannel,
  getActiveChannelForDelete,
  setShowModalDeleteChannel,
  setDeleteChannel,
} from '../slices/channelsSlice.js';
import { deleteMessagesDuringDeleteChannel } from '../slices/messagesSlice.js';
import axios from 'axios';
import routes from '../routes.js';
import { getToken } from '../slices/authorizationSlice.js';
//import { io } from 'socket.io-client';

//const socket = io('http://localhost:3000');

const ModalDeleteChannel = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // Вытащить значения из authorizationSlice
  const token = useSelector(getToken);

  // При закрытии окна - изменяем в стейте showModalDeleteChannel на true или false
  const handleSetShowModalDeleteChannel = () => {
    dispatch(setShowModalDeleteChannel());
  };

  // Функция для удаления канала по имени и последующего обновления в state
  const handleSetDeleteChannel = async (userToken, deletedChannelId) => {
    const pathToDeleteChannel = [routes.channelsPath(), deletedChannelId].join('/');
    //const pathToDeleteMessage = [routes.messagesPath(), deletedChannelId].join('/');
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
      }
    }
    catch (e) {
      console.log(e);
    }
  };
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

  const channels = useSelector(getChannels);
  const activeChannelForDelete = useSelector(getActiveChannelForDelete);

  return (
      <Modal show onHide={handleSetShowModalDeleteChannel} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('channels.channelDelete')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="lead">{t('channels.areYouSure')}?</p>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleSetShowModalDeleteChannel}>
                {t('channels.cancelButton')}
              </Button>
              <Button variant="danger" type="submit" disabled="" onClick={() => handleSetDeleteChannel(token, activeChannelForDelete.id)}>
                {t('channels.deleteButton')}
              </Button>
            </Modal.Footer>
        </Modal.Body>
      </Modal>
  );
};

export default ModalDeleteChannel;