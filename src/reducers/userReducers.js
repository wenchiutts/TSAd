import createReducers from 'reducers/createReducers';
import { RECEIVE_USER_PROFILE, UPDATE_PREMIUM } from 'actions/userActions';

const initialState = {
  hasLaunched: false,
  premium: {
    status: 'inactive', // 'inactive' | 'active' | 'expired'
    productId: null,
    lastUpdatedAt: null,
  },
};

export default createReducers(initialState, {
  [UPDATE_PREMIUM]: (state, action) => ({
    ...state,
    premium: {
      ...state.premium,
      status: action.purchase?.status,
      productId: action.purchase?.productId,
      lastUpdatedAt: action.purchase?.lastUpdatedAt,
    },
  }),
  [RECEIVE_USER_PROFILE]: (state, action) => ({
    ...state,
    ...action.profile,
  }),
});
