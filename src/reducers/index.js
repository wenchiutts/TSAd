// @format
import { combineReducers } from 'redux';
import timeReducers from './timeReducers';

const rootReducer = combineReducers({
  time: timeReducers,
});

export default rootReducer;
