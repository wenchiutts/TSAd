// @format
import createReducers from 'reducers/createReducers';
import {
  RECEIVE_INS_COOKIES,
  REQUEST_INS_COOKIES,
  REQUEST_INS_USER_PROFILE,
  RECEIVE_INS_USER_PROFILE,
} from 'modules/instagram/insAuthActions';

const initialState = {
  cookies: undefined,
  profile: undefined,
  isFetching: false,
};

export default createReducers(initialState, {
  [RECEIVE_INS_COOKIES]: (state, actions) => ({
    ...state,
    cookies: actions.cookies,
    isFetching: false,
  }),
  [REQUEST_INS_COOKIES]: (state, actions) => ({
    ...state,
    cookies: undefined,
    isFetching: true,
  }),
  [REQUEST_INS_USER_PROFILE]: (state, actions) => ({
    ...state,
    isFetching: true,
  }),
  [RECEIVE_INS_USER_PROFILE]: (state, actions) => ({
    ...state,
    isFetching: false,
    profile: actions.profile,
  }),
});
