import createReducers from 'reducers/createReducers';
import { UPDATE_PREMIUM } from 'actions/userActions';

const initialState = {
  premium: {
    status: 'inactive',
    plan: null,
    lastUpdatedAt: null,
  },
};

export default createReducers(initialState, {
  [UPDATE_PREMIUM]: (state, action) => ({
    ...state,
    premium: {
      ...state.premium,
      status: action.status,
      plan: action.planType,
      lastUpdatedAt: action.purchaseTime,
    },
  }),
});
