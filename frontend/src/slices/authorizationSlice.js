/* eslint no-param-reassign: "error" */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: localStorage.getItem('username') || null,
  isAuthorization: !!localStorage.getItem('token'),
  token: localStorage.getItem('token') || null,
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
  },
});

export const { logIn, logOut } = authorizationSlice.actions;
export const getUser = (state) => state.authorization.username;
export const getIsAuthorization = (state) => state.authorization.isAuthorization;
export const getToken = (state) => state.authorization.token;

export default authorizationSlice.reducer;
