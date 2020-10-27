import { compose, path, converge, assocPath, nth, ifElse, unapply, evolve, add } from 'ramda';

import createReducers from 'reducers/createReducers';
import {
  RECEIVE_USER_PROFILE,
  UPDATE_PREMIUM,
  UPDATE_LAUNCH_TIMES,
  SET_JOIN_TIMESTAMP,
} from 'actions/userActions';
import { isNilOrEmpty } from 'utils/ramdaUtils';
import { LOG_OUT_INS } from 'modules/instagram/insAuthActions';

const initialState = {
  hasLaunched: false,
  launchTimes: 0,
  premium: {
    status: 'inactive', // 'inactive' | 'active' | 'expired'
    productId: null,
    lastUpdatedAt: null,
  },
  joinTimestamp: null,
};

// maySetJoinTimestamp :: (state, action) -> Obj
const maySetJoinTimestamp = unapply(
  ifElse(
    compose(isNilOrEmpty, path([0, 'joinTimestamp'])),
    converge(assocPath(['joinTimestamp']), [path([1, 'timestamp']), nth(0)]),
    nth(0),
  ),
);

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
  [UPDATE_LAUNCH_TIMES]: evolve({
    launchTimes: add(1),
  }),
  [SET_JOIN_TIMESTAMP]: maySetJoinTimestamp,
  [LOG_OUT_INS]: state => ({
    ...initialState,
    hasLaunched: state.hasLaunched,
  }),
});
