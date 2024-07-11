/* eslint-disable */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthorization: false,
  token: null,
  showNotifyNetworkError: false,
  showNotifyServerError: false,
};

const authorizationSlice = createSlice({
  name: 'authorization',
  initialState,
  reducers: {
    logIn(state, action) {
      state.user = action.payload;
      state.isAuthorization = true;
    },
    logOut(state){
      state.user = null;
      state.isAuthorization = false;
      state.token = null;
    },
    setToken(state, action){
      state.token = action.payload;
    },
    setUser(state, action){
      state.user = action.payload;
    },
    setAuthorization(state){
      state.isAuthorization = true;
    },
    setShowNotifyNetworkError(state){
      state.showNotifyNetworkError = !state.showNotifyNetworkError;
    },
    setShowNotifyServerError(state){
      state.showNotifyServerError = !state.showNotifyServerError;
    },
  },
});

export const { logIn, logOut, setToken, setUser, setAuthorization, setShowNotifyNetworkError, setShowNotifyServerError } = authorizationSlice.actions;
export const getUser = (state) => state.authorization.user;
export const getIsAuthorization = (state) => state.authorization.isAuthorization;
export const getToken = (state) => state.authorization.token;
export const getShowNotifyNetworkError = (state) => state.authorization.showNotifyNetworkError;
export const getShowNotifyServerError = (state) => state.authorization.showNotifyServerError;

export default authorizationSlice.reducer;