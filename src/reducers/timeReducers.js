// @format
import { REQUEST_TIME, RECEIVE_TIME } from 'actions/timeActions';
import createReducers from './createReducers';

const initialState = {
  data: undefined,
  isFetching: false,
};

export default createReducers(initialState, {
  [REQUEST_TIME]: (state, action) => ({
    ...state,
    isFetching: true,
  }),
  [RECEIVE_TIME]: (state, action) => ({
    ...state,
    isFetching: false,
    data: action.time,
  }),
});
