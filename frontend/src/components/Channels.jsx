import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Dropdown, Button, SplitButton } from 'react-bootstrap';
import {
  getChannels,
  getActiveChannelId,
  setActiveChannel,
  setShowModalAddChannel,
  setShowModalRenameChannel,
  setChannelDataForRename,
  setShowModalDeleteChannel,
  setChannelDataForDelete,
} from '../slices/channelsSlice';
import '../App.css';

const Channels = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const channels = useSelector(getChannels);
  const activeChannelId = useSelector(getActiveChannelId);

  const handleSetActiveChannel = (id) => {
    dispatch(setActiveChannel(id));
  };

  const handleSetShowModalAddChannel = () => {
    dispatch(setShowModalAddChannel());
  };

  const handleSetChannelDataForRename = (channelId, channelName) => {
    dispatch(setChannelDataForRename({ channelId, channelName }));
    dispatch(setShowModalRenameChannel());
  };

  const handleSetChannelDataForDelete = (channelId) => {
    dispatch(setChannelDataForDelete({ channelId }));
    dispatch(setShowModalDeleteChannel());
  };

  return (
    <>
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>{t('channels.channels')}</b>
        <button
          type="button"
          className="p-0 text-primary btn btn-group-vertical"
          onClick={handleSetShowModalAddChannel}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width="20"
            height="20"
            fill="currentColor"
          >
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
          </svg>
          <span className="visually-hidden">{t('channels.addButtonSymbol')}</span>
        </button>
      </div>

      <ul
        id="channels-box"
        className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
      >
        {channels.length > 0 ? (
          channels.map((channel) => (
            <li key={channel.id} className="nav-item w-100">
              {channel.removable
                ? (
                  <SplitButton
                    variant={Number(channel.id) === Number(activeChannelId) ? 'secondary' : ''}
                    title={`# ${channel.name}`}
                    onClick={() => handleSetActiveChannel(channel.id)}
                    className="w-100 flex-grow-0"
                  >
                    <span className="visually-hidden">{t('channels.control')}</span>
                    <Dropdown.Item eventKey="1" onClick={() => handleSetChannelDataForDelete(channel.id)}>{t('channels.deleteButton')}</Dropdown.Item>
                    <Dropdown.Item eventKey="2" onClick={() => handleSetChannelDataForRename(channel.id, channel.name)}>{t('channels.renameButton')}</Dropdown.Item>
                  </SplitButton>
                )
                : (
                  <Button
                    variant={Number(channel.id) === Number(activeChannelId) ? 'secondary' : ''}
                    onClick={() => handleSetActiveChannel(channel.id)}
                    className="w-100"
                  >
                    <span className="me-1">#</span>
                    {channel.name}
                  </Button>
                )}
            </li>
          ))
        ) : (
          <div>{t('channels.noChannels')}</div>
        )}
      </ul>
    </>
  );
};

export default Channels;
