/* eslint-disable */

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getChannels, getActiveChannelId, setChannels, setActiveChannel, getActiveChannelName } from '../slices/channelsSlice.js';
import cn from 'classnames';


const Channels = () => {
  const dispatch = useDispatch();

  // Вытащить значения из channelsSlice
  const channels = useSelector(getChannels);
  const activeChannelId = useSelector(getActiveChannelId);
  const activeChannelName = useSelector(getActiveChannelName);

  const activeChannelClass = cn([
    'w-100',
    'rounded-0',
    'text-start',
    'btn',
    'btn-secondary',
  ]);

  const notActiveChannelClass = cn([
    'w-100',
    'rounded-0',
    'text-start',
    'btn',
  ]);

  const handleSetActiveChannel = (id) => {
    dispatch(setActiveChannel(id));
  }


  return (
    <div>
      <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
        {channels.length > 0 ? (
          channels.map((channel) => (
            <li key={channel.id} className="nav-item w-100">
              <button
              type="button"
              className={channel.id === activeChannelId ? activeChannelClass : notActiveChannelClass}
              onClick={() => handleSetActiveChannel(channel.id)}
              >
                <span className="me-1">#</span>
                {channel.name}
              </button>
            </li>
          ))
        ) : (
          <div> Массив каналов пуст</div>
        )}
      </ul>
    </div>
  );
};

export default Channels;