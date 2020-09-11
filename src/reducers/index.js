// @format
import { combineReducers } from 'redux';
import timeReducers from 'reducers/timeReducers';
import instagramReducers from 'modules/instagram/insAuthReducers';
import firebaseReducer from 'modules/auth/authReducers';

const rootReducer = combineReducers({
  time: timeReducers,
  instagram: instagramReducers,
  firebase: firebaseReducer,
});

export default rootReducer;
