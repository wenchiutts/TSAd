// @format
import { combineReducers } from 'redux';
import timeReducers from 'reducers/timeReducers';

const rootReducer = combineReducers({
  time: timeReducers,
});

export default rootReducer;
