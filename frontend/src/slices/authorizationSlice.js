/* eslint-disable */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthorization: false,
  token: null,
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
    }
  },
});

export const { logIn, logOut, setToken, setUser, setAuthorization } = authorizationSlice.actions;
export const getUser = (state) => state.authorization.user;
export const getIsAuthorization = (state) => state.authorization.isAuthorization;
export const getToken = (state) => state.authorization.token;

export default authorizationSlice.reducer;