import {
  RECEIVE_PURCHASE_HISTORY
} from 'actions/paymentActions';

import createReducers from './createReducers';

const initialState = {
  history: [],
};

export default createReducers(initialState, {
  [RECEIVE_PURCHASE_HISTORY]: (state, action) => ({
    ...state,
    history: action.history,
  }),
});