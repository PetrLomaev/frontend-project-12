/* eslint-disable */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  channels: [],
  activeChannelId: 1,
  showModalAddChannel: false,
  showModalRenameChannel: false,
  showModalDeleteChannel: false,
  activeChannelForRename: {
    id: null,
    name: '',
  },
  activeChannelForDelete: {
    id: null,
  },
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
    addChannel(state, action){
      state.channels = [...state.channels, action.payload];
    },
    setShowModalAddChannel(state){
      state.showModalAddChannel = !state.showModalAddChannel;
    },
    setShowModalRenameChannel(state){
      state.showModalRenameChannel = !state.showModalRenameChannel;
    },
    setShowModalDeleteChannel(state){
      state.showModalDeleteChannel = !state.showModalDeleteChannel;
    },
    setNewChannelName(state, action) { // Обновить имя конкретного канала по указанному id и newName
      const { id, newName } = action.payload;
      state.channels.forEach((channel) => {
        if (channel.id === id) {
          channel.name = newName;
        }
      });
    },
    setChannelDataForRename(state, action){
      const { channelId, channelName } = action.payload;
      state.activeChannelForRename.id = channelId;
      state.activeChannelForRename.name = channelName;
    },
    setDeleteChannel(state, action){
      const { id } = action.payload;
      const updatedChannels = state.channels.filter((channel) => channel.id !== id);
      state.channels = updatedChannels;
    },
    setChannelDataForDelete(state, action){
      const { channelId } = action.payload;
      state.activeChannelForDelete.id = channelId;

    },
  },
});

export const {
  setChannels,
  setActiveChannel,
  addChannel,
  setShowModalAddChannel,
  setShowModalRenameChannel,
  setNewChannelName,
  setChannelDataForRename,
  setShowModalDeleteChannel,
  setDeleteChannel,
  setChannelDataForDelete,
} = channelsSlice.actions;
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
export const getShowModalAddChannel = (state) => state.channels.showModalAddChannel;
export const getShowModalRenameChannel = (state) => state.channels.showModalRenameChannel;
export const getShowModalDeleteChannel = (state) => state.channels.showModalDeleteChannel;
export const getActiveChannelForRename = (state) => state.channels.activeChannelForRename;
export const getActiveChannelForDelete = (state) => state.channels.activeChannelForDelete;

export default channelsSlice.reducer;