import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {
  setActiveChannel,
  getActiveChannelForChange,
  setShowModalDeleteChannel,
} from '../slices/channelsSlice';
import { getToken } from '../slices/authorizationSlice';
import { deleteMessagesDuringDeleteChannel } from '../slices/messagesSlice';
import { serverRoutes } from '../routes';
import { notifySucess, notifyError } from '../utils/notify';
import 'react-toastify/dist/ReactToastify.css';

const ModalDeleteChannel = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const token = useSelector(getToken);

  const handleSetShowModalDeleteChannel = () => {
    dispatch(setShowModalDeleteChannel());
  };

  const handleSetDeleteChannel = async (userToken, deletedChannelId) => {
    const pathToDeleteChannel = [serverRoutes.channelsPath(), deletedChannelId].join('/');
    try {
      const response = await axios.delete(pathToDeleteChannel, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (response.data) {
        dispatch(deleteMessagesDuringDeleteChannel({ id: response.data.id }));
        handleSetShowModalDeleteChannel();
        dispatch(setActiveChannel(1));
        notifySucess(t('channels.notifyDelete'));
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

  const activeChannelForDelete = useSelector(getActiveChannelForChange);

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
