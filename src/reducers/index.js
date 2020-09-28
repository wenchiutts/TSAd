// @format
import { combineReducers } from 'redux';
import timeReducers from 'reducers/timeReducers';
import instagramReducers from 'modules/instagram/insAuthReducers';
import firebaseReducer from 'modules/auth/authReducers';
import userReducers from 'reducers/userReducers';
import paymentReducers from 'reducers/paymentReducers';

const rootReducer = combineReducers({
  time: timeReducers,
  instagram: instagramReducers,
  firebase: firebaseReducer,
  user: userReducers,
  payment: paymentReducers,
});

export default rootReducer;
