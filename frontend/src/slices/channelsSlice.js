/* eslint-disable */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  channels: [],
  activeChannel: 1,
};

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setChannels(state, action) {
      state.channels = action.payload;
    },
    setActiveChannel(state, action){
      state.activeChannel = action.payload;
    },
  },
});

export const { setChannels, setActiveChannel } = channelsSlice.actions;
export const getChannels = (state) => state.channels.channels;
export const getActiveChannel = (state) => state.channels.activeChannel;
export default channelsSlice.reducer;