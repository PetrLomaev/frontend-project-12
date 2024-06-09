/* eslint-disable */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  amountOfMessages: 0,
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    loadMessages(state, action) { // Подгрузить все сообщения
      state.messages = action.payload;
    },
    addMessage(state, action){ // Добавить ОДНО сообщение
      state.messages.push(action.payload);
      state.amountOfMessages += 1;
    },
  },
});

export const { loadMessages, addMessage } = messagesSlice.actions;
export const getMessages = (state) => state.messages.messages;
export const getAmountOfMessages = (state) => state.messages.amountOfMessages;
export default messagesSlice.reducer;