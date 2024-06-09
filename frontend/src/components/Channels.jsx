/* eslint-disable */

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getChannels, getActiveChannel, setChannels } from '../slices/channelsSlice.js';


const Channels = () => {
  const dispatch = useDispatch();

  // Вытащить значения из channelsSlice
  const channels = useSelector(getChannels);
  const activeChannel = useSelector(getActiveChannel);



  return (
    <div>
      <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
        {channels.length > 0 ? (
          channels.map((channel) => (
            <li key={channel.id} className="nav-item w-100">
              <button
              type="button"
              className="w-100 rounded-0 text-start btn btn-secondary">
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