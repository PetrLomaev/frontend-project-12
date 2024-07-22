/* eslint no-param-reassign: "error" */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  amountOfMessages: 0,
  inTheProcessSending: false,
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    loadMessages(state, action) { // Подгрузить ВСЕ сообщения в стейт
      state.messages = action.payload;
    },
    addMessage(state, action) { // Добавить ОДНО сообщение
      state.messages.push(action.payload);
      state.amountOfMessages = state.messages.length;
    },
    deleteMessagesDuringDeleteChannel(state, action) { // При удалении канала удалить сообщения
      const { id } = action.payload;
      const updatedMessages = state.messages.filter((message) => message.channelId !== id);
      state.messages = updatedMessages;
    },
    setInTheProcessSending(state) {
      state.inTheProcessSending = !state.inTheProcessSending;
    },
  },
});

export const {
  loadMessages, addMessage, deleteMessagesDuringDeleteChannel, setInTheProcessSending,
} = messagesSlice.actions;
export const getMessages = (state) => state.messages.messages;
export const getCountOfMessages = (state, activeChannelId) => {
  const messagesOfActiveChannel = state.messages.messages
    .filter((message) => message.channelId === activeChannelId);
  return messagesOfActiveChannel.length;
};
export const getInTheProcessSending = (state) => state.messages.inTheProcessSending;
export default messagesSlice.reducer;
