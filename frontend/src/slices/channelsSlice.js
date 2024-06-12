/* eslint-disable */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  channels: [],
  activeChannelId: 1,
};

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setChannels(state, action) {
      state.channels = action.payload;
    },
    setActiveChannel(state, action){
      state.activeChannelId = action.payload;
    },
  },
});

export const { setChannels, setActiveChannel } = channelsSlice.actions;
export const getChannels = (state) => state.channels.channels;
export const getActiveChannelId = (state) => state.channels.activeChannelId;
export const getActiveChannelName = (state) => {
  const isActive = (element) => {
    const currentActiveId = getActiveChannelId(state);
    return Number(element.id) === Number(currentActiveId);
  };
  const activeChannel = state.channels.channels.find(isActive);
  return activeChannel ? activeChannel.name : null;
};
export default channelsSlice.reducer;