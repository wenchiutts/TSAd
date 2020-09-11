// @format
import createReducers from 'reducers/createReducers';
import { FIREBASE_RECEIVE_AUTH, FIREBASE_REQUEST_AUTH } from 'modules/auth/authActions';

const initialState = {
  isFetching: false,
  user: undefined,
};

export default createReducers(initialState, {
  [FIREBASE_RECEIVE_AUTH]: (state, actions) => ({
    ...state,
    isFetching: false,
    user: actions.user,
  }),
  [FIREBASE_REQUEST_AUTH]: (state, actions) => ({
    ...state,
    isFetching: true,
  }),
});
