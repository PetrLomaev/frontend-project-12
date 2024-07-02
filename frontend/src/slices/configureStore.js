/* eslint-disable */

import { configureStore } from '@reduxjs/toolkit';
import authorizationReducer from './authorizationSlice';
import channelsReducer from './channelsSlice';
import messagesReducer from './messagesSlice';
import signUpReducer from './signUpSlice';

export default configureStore({
  reducer: {
    authorization: authorizationReducer,
    channels: channelsReducer,
    messages: messagesReducer,
    registration: signUpReducer,
    // еще редьюсеры...
  },
});

