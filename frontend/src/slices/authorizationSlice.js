/* eslint-disable */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: '',
  isAuthorization: false,
  token: '',
};

const authorizationSlice = createSlice({
  name: 'authorization',
  initialState,
  reducers: {
    logIn(state, action) {
      state.user = action.payload;
      state.isAuthorization = true;
    },
    logOut(state, action){
      state.isAuthorization = false;
      localStorage.clear();
    },
    setToken(state, action){
      state.token = action.payload;
    },
    setUser(state, action){
      state.user = action.payload;
    },
  },
});

export const { logIn, logOut, setToken, setUser } = authorizationSlice.actions;
export const getUser = (state) => state.authorization.user;
export const getIsAuthorization = (state) => state.authorization.isAuthorization;
export const getToken = (state) => state.authorization.token;

export default authorizationSlice.reducer;