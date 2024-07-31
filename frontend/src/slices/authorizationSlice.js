/* eslint no-param-reassign: "error" */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: localStorage.getItem('username') || null,
  isAuthorization: !!localStorage.getItem('token'),
  token: localStorage.getItem('token') || null,
  showNotifyNetworkError: false,
  showNotifyServerError: false,
};

const authorizationSlice = createSlice({
  name: 'authorization',
  initialState,
  reducers: {
    logIn(state, action) {
      const { token, username } = action.payload;
      state.username = username;
      state.isAuthorization = true;
      state.token = token;
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
    },
    logOut(state) {
      state.username = null;
      state.isAuthorization = false;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    },
    setShowNotifyNetworkError(state) {
      state.showNotifyNetworkError = !state.showNotifyNetworkError;
    },
    setShowNotifyServerError(state) {
      state.showNotifyServerError = !state.showNotifyServerError;
    },
  },
});

export const {
  logIn,
  logOut,
  setShowNotifyNetworkError,
  setShowNotifyServerError,
} = authorizationSlice.actions;
export const getUser = (state) => state.authorization.username;
export const getIsAuthorization = (state) => state.authorization.isAuthorization;
export const getToken = (state) => state.authorization.token;
export const getShowNotifyNetworkError = (state) => state.authorization.showNotifyNetworkError;
export const getShowNotifyServerError = (state) => state.authorization.showNotifyServerError;

export default authorizationSlice.reducer;
